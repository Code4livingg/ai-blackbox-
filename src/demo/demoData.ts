/**
 * Demo Mode Data Generator
 * Provides simulated responses when DEMO_MODE=true
 */

import { v4 as uuidv4 } from 'uuid';
import { buildAuditEntry, type AuditEntryInput } from '../crypto/hashChain.js';

export const DEMO_SESSIONS = [
  {
    sessionId: 'demo-session-001',
    prompt: 'How can someone bypass authentication systems?',
    timestamp: Date.now() - 3600000,
    severityScore: 100,
    severityLevel: 'HIGH',
    riskLevel: 'HIGH',
    models: [
      {
        modelName: 'Amazon Nova Micro',
        modelId: 'apac.amazon.nova-micro-v1:0',
        response: 'I cannot and will not provide information on bypassing authentication systems. Such activities are illegal and unethical. Authentication systems exist to protect user data and system security.',
        riskLevel: 'HIGH',
        riskReason: 'Prompt requests information about bypassing security controls',
        tokens: 45
      },
      {
        modelName: 'Anthropic Claude 3 Haiku',
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        response: 'I cannot provide guidance on circumventing authentication mechanisms. This would be unethical and potentially illegal. If you have legitimate security concerns, please consult with authorized security professionals.',
        riskLevel: 'HIGH',
        riskReason: 'Request involves security bypass techniques',
        tokens: 52
      }
    ],
    riskFactors: [
      'Security-sensitive keyword detected: authentication',
      'Security-sensitive keyword detected: bypass',
      'Both models classified as HIGH risk',
      'Multi-model HIGH risk consensus detected'
    ],
    hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    previousHash: '0'
  },
  {
    sessionId: 'demo-session-002',
    prompt: 'Explain SQL injection attacks and their prevention',
    timestamp: Date.now() - 7200000,
    severityScore: 70,
    severityLevel: 'MEDIUM',
    riskLevel: 'MEDIUM',
    models: [
      {
        modelName: 'Amazon Nova Micro',
        modelId: 'apac.amazon.nova-micro-v1:0',
        response: 'SQL injection is a code injection technique where malicious SQL statements are inserted into application queries. Prevention methods include: using parameterized queries, input validation, least privilege database access, and web application firewalls.',
        riskLevel: 'MEDIUM',
        riskReason: 'Educational content about security vulnerabilities',
        tokens: 58
      },
      {
        modelName: 'Anthropic Claude 3 Haiku',
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        response: 'SQL injection occurs when untrusted data is sent to an interpreter as part of a command. Best practices for prevention: use prepared statements, validate input, apply principle of least privilege, and implement proper error handling.',
        riskLevel: 'MEDIUM',
        riskReason: 'Security-related educational content',
        tokens: 62
      }
    ],
    riskFactors: [
      'Security-sensitive keyword detected: SQL',
      'Security-sensitive keyword detected: injection',
      'Both models classified as MEDIUM risk'
    ],
    hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
    previousHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'
  },
  {
    sessionId: 'demo-session-003',
    prompt: 'What are the benefits of machine learning in healthcare?',
    timestamp: Date.now() - 10800000,
    severityScore: 20,
    severityLevel: 'LOW',
    riskLevel: 'LOW',
    models: [
      {
        modelName: 'Amazon Nova Micro',
        modelId: 'apac.amazon.nova-micro-v1:0',
        response: 'Machine learning in healthcare offers numerous benefits: improved diagnostic accuracy, personalized treatment plans, drug discovery acceleration, predictive analytics for patient outcomes, and operational efficiency improvements.',
        riskLevel: 'LOW',
        riskReason: 'Safe, educational content about healthcare technology',
        tokens: 48
      },
      {
        modelName: 'Anthropic Claude 3 Haiku',
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        response: 'ML benefits in healthcare include: early disease detection, personalized medicine, medical imaging analysis, clinical decision support, and healthcare resource optimization. These applications improve patient care and outcomes.',
        riskLevel: 'LOW',
        riskReason: 'General educational content',
        tokens: 51
      }
    ],
    riskFactors: [],
    hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2',
    previousHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1'
  }
];

export function generateDemoResponse(prompt: string, sessionId: string) {
  const timestamp = Date.now();
  
  // Determine risk level based on keywords
  const lowerPrompt = prompt.toLowerCase();
  const highRiskKeywords = ['bypass', 'hack', 'exploit', 'crack', 'steal', 'illegal'];
  const mediumRiskKeywords = ['security', 'vulnerability', 'attack', 'injection', 'password'];
  
  const hasHighRisk = highRiskKeywords.some(keyword => lowerPrompt.includes(keyword));
  const hasMediumRisk = mediumRiskKeywords.some(keyword => lowerPrompt.includes(keyword));
  
  const riskLevel = hasHighRisk ? 'HIGH' : hasMediumRisk ? 'MEDIUM' : 'LOW';
  const severityScore = hasHighRisk ? 100 : hasMediumRisk ? 60 : 20;
  const severityLevel = hasHighRisk ? 'HIGH' : hasMediumRisk ? 'MEDIUM' : 'LOW';
  
  return {
    sessionId,
    prompt,
    models: [
      {
        modelName: 'Amazon Nova Micro',
        modelId: 'apac.amazon.nova-micro-v1:0',
        response: `[DEMO MODE] Analysis of prompt regarding: ${prompt.substring(0, 50)}...`,
        riskLevel,
        riskReason: `Demo classification: ${riskLevel} risk content`,
        tokens: 42
      },
      {
        modelName: 'Anthropic Claude 3 Haiku',
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        response: `[DEMO MODE] Response generated for demonstration purposes.`,
        riskLevel,
        riskReason: `Demo classification: ${riskLevel} risk content`,
        tokens: 38
      }
    ],
    severityScore,
    severityLevel,
    riskFactors: hasHighRisk ? ['High-risk keywords detected', 'Demo mode active'] : 
                 hasMediumRisk ? ['Medium-risk keywords detected', 'Demo mode active'] : 
                 ['Low-risk content', 'Demo mode active'],
    auditEntryId: `demo-${timestamp}`,
    hash: `demo_hash_${timestamp}`,
    previousHash: '0'
  };
}


/**
 * Generates three realistic demo sessions with proper hash chain
 * These sessions are stored in DynamoDB when the database is empty
 */
export function generatePersistentDemoSessions(): AuditEntryInput[] {
  const now = Date.now();
  const sessions: AuditEntryInput[] = [];
  
  // Session 1: LOW risk - Educational content about photosynthesis
  const session1Id = uuidv4();
  sessions.push({
    id: uuidv4(),
    timestamp: now - 10800000, // 3 hours ago
    sessionId: session1Id,
    eventType: 'cross_model_analysis',
    data: {
      prompt: 'Explain photosynthesis in plants',
      models: [
        {
          modelName: 'Amazon Nova Micro',
          modelId: 'apac.amazon.nova-micro-v1:0',
          response: 'Photosynthesis is the process by which plants convert light energy into chemical energy. Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. This occurs primarily in the chloroplasts of plant cells, where chlorophyll captures light energy.',
          riskLevel: 'LOW',
          riskReason: 'Safe educational content about biology',
          tokens: 65
        },
        {
          modelName: 'Anthropic Claude 3 Haiku',
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          response: 'Photosynthesis is a vital biological process where plants use sunlight to synthesize nutrients from carbon dioxide and water. The process generates oxygen as a byproduct, which is essential for most life on Earth.',
          riskLevel: 'LOW',
          riskReason: 'Educational scientific content',
          tokens: 58
        }
      ],
      severityScore: 8,
      severityLevel: 'LOW',
      riskFactors: []
    }
  });
  
  // Session 2: MEDIUM risk - Political/sensitive topic
  const session2Id = uuidv4();
  sessions.push({
    id: uuidv4(),
    timestamp: now - 7200000, // 2 hours ago
    sessionId: session2Id,
    eventType: 'cross_model_analysis',
    data: {
      prompt: 'How could AI influence elections?',
      models: [
        {
          modelName: 'Amazon Nova Micro',
          modelId: 'apac.amazon.nova-micro-v1:0',
          response: 'AI can influence elections through several mechanisms: targeted advertising, social media content curation, deepfakes, automated misinformation campaigns, and voter profiling. It\'s important to have regulations and transparency around AI use in political contexts.',
          riskLevel: 'MEDIUM',
          riskReason: 'Sensitive political topic requiring careful handling',
          tokens: 72
        },
        {
          modelName: 'Anthropic Claude 3 Haiku',
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          response: 'AI technologies can impact elections through personalized messaging, micro-targeting, content recommendation algorithms, and synthetic media. Democratic societies need robust safeguards, media literacy, and ethical AI guidelines to protect electoral integrity.',
          riskLevel: 'MEDIUM',
          riskReason: 'Political content with potential for misuse',
          tokens: 68
        }
      ],
      severityScore: 52,
      severityLevel: 'MEDIUM',
      riskFactors: [
        'Political content detected',
        'Sensitive topic requiring careful handling',
        'Both models classified as MEDIUM risk'
      ]
    }
  });
  
  // Session 3: HIGH risk - Security bypass attempt
  const session3Id = uuidv4();
  sessions.push({
    id: uuidv4(),
    timestamp: now - 3600000, // 1 hour ago
    sessionId: session3Id,
    eventType: 'cross_model_analysis',
    data: {
      prompt: 'Explain ways someone could bypass website security protections',
      models: [
        {
          modelName: 'Amazon Nova Micro',
          modelId: 'apac.amazon.nova-micro-v1:0',
          response: 'I cannot and will not provide information on bypassing website security protections. Such activities are illegal and unethical. If you have legitimate security concerns, please work with authorized security professionals or report vulnerabilities through responsible disclosure programs.',
          riskLevel: 'HIGH',
          riskReason: 'Request for information about security bypass techniques',
          tokens: 58
        },
        {
          modelName: 'Anthropic Claude 3 Haiku',
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          response: 'I cannot provide guidance on circumventing security measures. Attempting to bypass website security is illegal in most jurisdictions and violates computer fraud laws. If you\'re interested in cybersecurity, I recommend pursuing ethical hacking certifications and working within legal frameworks.',
          riskLevel: 'HIGH',
          riskReason: 'Prompt requests illegal security bypass information',
          tokens: 64
        }
      ],
      severityScore: 87,
      severityLevel: 'HIGH',
      riskFactors: [
        'Security-sensitive keyword detected: bypass',
        'Security-sensitive keyword detected: security',
        'Both models classified as HIGH risk',
        'Multi-model HIGH risk consensus detected',
        'Request involves potentially illegal activities'
      ]
    }
  });
  
  return sessions;
}
