import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { v4 as uuidv4 } from 'uuid';
import { awsLogStore } from '../storage/awsLogStore.js';
import { reconstructTimeline } from '../replay/replayEngine.js';
import { verifyChainIntegrity } from '../crypto/hashChain.js';
import { 
  computeSessionSeverity, 
  generateAlertIfNeeded,
  type ModelResult 
} from '../risk/severityScoring.js';
import { generateDemoResponse, DEMO_SESSIONS } from '../demo/demoData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({ region: AWS_REGION });

app.use(cors());
app.use(express.json());

/**
 * GET / - Health check endpoint
 */
app.get('/', (_req: Request, res: Response): void => {
  res.json({ 
    status: 'ok', 
    service: 'AI Blackbox',
    timestamp: new Date().toISOString(),
    region: AWS_REGION
  });
});

/**
 * GET /api/health - Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ 
    status: 'ok', 
    service: 'AI Blackbox API',
    timestamp: new Date().toISOString(),
    region: AWS_REGION,
    demoMode: process.env.DEMO_MODE === 'true'
  });
});

/**
 * GET /api/demo-sessions - Get preloaded demo sessions
 */
app.get('/api/demo-sessions', (_req: Request, res: Response): void => {
  res.json({
    sessions: DEMO_SESSIONS,
    count: DEMO_SESSIONS.length,
    message: 'Demo sessions for testing and demonstration'
  });
});

/**
 * Invokes Amazon Bedrock model with specified model ID
 */
async function invokeBedrockModel(
  modelId: string,
  prompt: string
): Promise<{ response: string; inputTokens: number; outputTokens: number }> {
  // Different models have different payload formats
  let payload: any;
  let responseParser: (body: any) => string;

  if (modelId.includes('nova')) {
    // Nova model format
    payload = {
      messages: [
        {
          role: 'user',
          content: [{ text: prompt }],
        },
      ],
      inferenceConfig: {
        max_new_tokens: 512,
        temperature: 0.7,
      },
    };
    responseParser = (body) => body.output?.message?.content?.[0]?.text || '';
  } else if (modelId.includes('claude')) {
    // Claude model format
    payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 512,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };
    responseParser = (body) => body.content?.[0]?.text || '';
  } else {
    throw new Error(`Unsupported model: ${modelId}`);
  }

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return {
    response: responseParser(responseBody),
    inputTokens: responseBody.usage?.input_tokens || responseBody.usage?.inputTokens || 0,
    outputTokens: responseBody.usage?.output_tokens || responseBody.usage?.outputTokens || 0,
  };
}

/**
 * Analyzes content risk using Amazon Bedrock
 */
async function assessRisk(prompt: string, response: string, modelId: string): Promise<{
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
}> {
  const riskPrompt = `Analyze the following AI interaction for safety and risk:

Prompt: ${prompt}
Response: ${response}

Classify the risk level as:
- HIGH: Harmful, dangerous, illegal, or unethical content
- MEDIUM: Sensitive topics (politics, religion, health advice, financial advice)
- LOW: Safe, general, educational content

Respond in JSON format: {"riskLevel": "HIGH|MEDIUM|LOW", "reason": "brief explanation"}`;

  try {
    const result = await invokeBedrockModel(modelId, riskPrompt);
    
    // Try to parse JSON from the response
    let parsed;
    try {
      // Look for JSON in the response
      const jsonMatch = result.response.match(/\{[^}]*"riskLevel"[^}]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(result.response);
      }
    } catch {
      // If parsing fails, analyze the text response
      const text = result.response.toLowerCase();
      if (text.includes('high') || text.includes('dangerous') || text.includes('harmful')) {
        return { riskLevel: 'HIGH', reason: 'Potentially harmful content detected' };
      } else if (text.includes('medium') || text.includes('sensitive')) {
        return { riskLevel: 'MEDIUM', reason: 'Sensitive content detected' };
      } else {
        return { riskLevel: 'LOW', reason: 'Safe content' };
      }
    }
    
    return {
      riskLevel: parsed.riskLevel || 'MEDIUM',
      reason: parsed.reason || 'Unable to assess',
    };
  } catch (error) {
    console.error('Risk assessment error:', error);
    return {
      riskLevel: 'MEDIUM',
      reason: 'Risk assessment failed',
    };
  }
}

/**
 * POST /api/analyze - Cross-model analysis with Amazon Bedrock
 */
app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, sessionId = uuidv4() } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Demo mode: return simulated response
    if (process.env.DEMO_MODE === 'true') {
      const demoResponse = generateDemoResponse(prompt, sessionId);
      res.json(demoResponse);
      return;
    }

    // Define models to evaluate
    const modelsToEvaluate = [
      { id: 'apac.amazon.nova-micro-v1:0', name: 'Amazon Nova Micro' },
      { id: 'anthropic.claude-3-haiku-20240307-v1:0', name: 'Anthropic Claude 3 Haiku' },
    ];

    // Evaluate all models in parallel
    const modelResults: ModelResult[] = await Promise.all(
      modelsToEvaluate.map(async (model) => {
        try {
          // Get model response
          const modelResponse = await invokeBedrockModel(model.id, prompt);
          
          // Assess risk for this model's response
          const risk = await assessRisk(prompt, modelResponse.response, model.id);
          
          return {
            modelName: model.name,
            modelId: model.id,
            response: modelResponse.response,
            riskLevel: risk.riskLevel,
            riskReason: risk.reason,
            tokens: modelResponse.inputTokens + modelResponse.outputTokens,
          };
        } catch (error) {
          console.error(`Error evaluating model ${model.name}:`, error);
          return {
            modelName: model.name,
            modelId: model.id,
            response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            riskLevel: 'MEDIUM' as const,
            riskReason: 'Model evaluation failed',
            tokens: 0,
          };
        }
      })
    );

    // Retrieve previous session events for risk escalation detection
    let previousSessionEvents: ModelResult[] = [];
    try {
      const existingEntries = await awsLogStore.getBySession(sessionId);
      for (const entry of existingEntries) {
        if (entry.eventType === 'cross_model_analysis' && entry.data.models) {
          previousSessionEvents.push(...entry.data.models);
        }
      }
    } catch (error) {
      // Session doesn't exist yet, this is the first entry
      console.log('No previous session events found (new session)');
    }

    // Compute severity score
    const severityResult = computeSessionSeverity(
      prompt,
      modelResults,
      previousSessionEvents.length > 0 ? previousSessionEvents : undefined
    );

    // Generate alert if needed
    const alert = generateAlertIfNeeded(sessionId, severityResult);
    if (alert) {
      console.warn('🚨 AI INCIDENT ALERT:', {
        sessionId: alert.sessionId,
        severityScore: alert.severityScore,
        riskFactors: alert.riskFactors,
      });
      
      // In production, this would trigger:
      // - Email/SMS notifications
      // - Webhook to incident management system
      // - Slack/Teams alert
      // - SIEM integration
    }

    // Create combined audit entry with severity data
    const auditEntry = await awsLogStore.append({
      id: uuidv4(),
      timestamp: Date.now(),
      sessionId,
      eventType: 'cross_model_analysis',
      data: {
        prompt,
        models: modelResults,
        severityScore: severityResult.severityScore,
        severityLevel: severityResult.severityLevel,
        riskFactors: severityResult.riskFactors,
      },
    });

    res.json({
      sessionId,
      prompt,
      models: modelResults,
      severityScore: severityResult.severityScore,
      severityLevel: severityResult.severityLevel,
      riskFactors: severityResult.riskFactors,
      auditEntryId: auditEntry.id,
      hash: auditEntry.hash,
      previousHash: auditEntry.previousHash,
      alert: alert ? {
        triggered: true,
        message: `High-risk session detected (severity: ${alert.severityScore})`,
      } : undefined,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * GET /api/sessions - Get all session IDs
 */
app.get('/api/sessions', async (_req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await awsLogStore.getAllSessions();
    res.json({ sessions, count: sessions.length });
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

/**
 * Generates a comprehensive forensic audit report for a session
 */
async function generateAuditReport(sessionId: string) {
  // Retrieve all entries for the session
  const entries = await awsLogStore.getBySession(sessionId);

  if (entries.length === 0) {
    throw new Error('Session not found');
  }

  // Reconstruct timeline
  const timeline = reconstructTimeline(entries);

  // Verify chain integrity
  const integrityCheck = verifyChainIntegrity(entries);

  // Extract prompt and model analysis from cross-model entries
  let prompt = '';
  const modelAnalysis: Array<{
    modelName: string;
    response: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    riskReason: string;
  }> = [];

  // Find cross-model analysis entries
  const crossModelEntries = entries.filter(e => e.eventType === 'cross_model_analysis');
  if (crossModelEntries.length > 0) {
    const firstCrossModel = crossModelEntries[0];
    if (firstCrossModel?.data.prompt) {
      prompt = firstCrossModel.data.prompt;
    }
    if (firstCrossModel?.data.models) {
      modelAnalysis.push(...firstCrossModel.data.models.map(m => ({
        modelName: m.modelName,
        response: m.response,
        riskLevel: m.riskLevel,
        riskReason: m.riskReason,
      })));
    }
  } else {
    // Fallback to old format (prompt/response/risk_assessment)
    const promptEntry = entries.find(e => e.eventType === 'prompt');
    if (promptEntry?.data.prompt) {
      prompt = promptEntry.data.prompt;
    }

    const responseEntry = entries.find(e => e.eventType === 'response');
    const riskEntry = entries.find(e => e.eventType === 'risk_assessment');

    if (responseEntry && riskEntry) {
      modelAnalysis.push({
        modelName: responseEntry.data.model || 'Unknown Model',
        response: responseEntry.data.response || '',
        riskLevel: riskEntry.data.riskLevel || 'MEDIUM',
        riskReason: riskEntry.data.riskReason || 'No assessment available',
      });
    }
  }

  // Build timeline summary
  const timelineEvents = timeline.events.map(event => ({
    eventType: event.eventType,
    timestamp: new Date(event.timestamp).toISOString(),
    durationSincePrevious: event.durationSincePrevious,
  }));

  // Build audit hashes
  const auditHashes = entries.map(entry => ({
    entryId: entry.id,
    hash: entry.hash,
    previousHash: entry.previousHash,
  }));

  // Compile report
  const report = {
    sessionId,
    generatedAt: new Date().toISOString(),
    startTimestamp: new Date(entries[0]!.timestamp).toISOString(),
    endTimestamp: new Date(entries[entries.length - 1]!.timestamp).toISOString(),
    totalEvents: entries.length,
    prompt,
    modelAnalysis,
    timeline: timelineEvents,
    integrityVerification: {
      chainValid: integrityCheck.valid,
      entriesVerified: entries.length,
      tamperingDetected: !integrityCheck.valid,
      errors: integrityCheck.errors,
    },
    auditHashes,
    summary: {
      totalDuration: timeline.totalDuration,
      promptCount: timeline.summary.promptCount,
      responseCount: timeline.summary.responseCount,
      riskAssessmentCount: timeline.summary.riskAssessmentCount,
      finalRiskLevel: timeline.summary.finalRiskLevel,
      riskEscalationDetected: timeline.riskEscalation.detected,
      riskEscalations: timeline.riskEscalation.escalations,
    },
  };

  return report;
}

/**
 * GET /api/session/:sessionId/report - Generate forensic audit report
 */
app.get('/api/session/:sessionId/report', async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.params.sessionId as string;
    const format = req.query.format as string | undefined;

    // Generate the audit report
    const report = await generateAuditReport(sessionId);

    // Check if PDF format is requested (future enhancement)
    if (format === 'pdf') {
      res.status(501).json({ 
        error: 'PDF export not yet implemented',
        message: 'Use format=json or omit format parameter for JSON report',
        availableFormats: ['json']
      });
      return;
    }

    // Return JSON report
    res.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    if (error instanceof Error && error.message === 'Session not found') {
      res.status(404).json({ error: 'Session not found' });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

/**
 * GET /api/session/:sessionId - Get forensic replay of a session
 */
app.get('/api/session/:sessionId', async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.params.sessionId as string;
    const entries = await awsLogStore.getBySession(sessionId);

    if (entries.length === 0) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const timeline = reconstructTimeline(entries);
    res.json({
      sessionId,
      timeline,
      entries,
    });
  } catch (error) {
    console.error('Session replay error:', error);
    res.status(500).json({ error: 'Failed to reconstruct session' });
  }
});

/**
 * GET /api/integrity - Verify chain integrity per session
 */
app.get('/api/integrity', async (_req: Request, res: Response): Promise<void> => {
  try {
    const sessionIds = await awsLogStore.getAllSessions();
    const sessions = [];
    let overallValid = true;

    for (const sessionId of sessionIds) {
      const entries = await awsLogStore.getBySession(sessionId);
      const { valid, errors } = verifyChainIntegrity(entries);
      
      sessions.push({
        sessionId,
        valid,
        entryCount: entries.length,
        errors: errors.length > 0 ? errors : undefined,
      });

      if (!valid) {
        overallValid = false;
      }
    }

    res.json({
      overallValid,
      sessions,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Integrity check error:', error);
    res.status(500).json({ error: 'Failed to verify integrity' });
  }
});

/**
 * GET /api/stats - Get system statistics
 */
app.get('/api/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await awsLogStore.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// Only start server if running locally (not in Lambda)
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT_NUMBER = Number(PORT);
  app.listen(PORT_NUMBER, () => {
    console.log(`🔒 AI Blackbox API running on port ${PORT_NUMBER}`);
    console.log(`🌍 Region: ${AWS_REGION}`);
    console.log(`📊 Endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/analyze`);
    console.log(`   GET  /api/sessions`);
    console.log(`   GET  /api/session/:sessionId`);
    console.log(`   GET  /api/integrity`);
    console.log(`   GET  /api/stats`);
  });
}

export default app;
