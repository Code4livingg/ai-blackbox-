/**
 * AI Incident Severity Scoring and Alert System
 * 
 * Computes a severity score (0-100) for AI interaction sessions based on:
 * - Risk levels from model evaluations
 * - Risk escalation patterns
 * - Security-sensitive prompt detection
 * - Multi-model agreement on high risk
 */

export interface ModelResult {
  modelName: string;
  modelId: string;
  response: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskReason: string;
  tokens: number;
}

export interface SeverityResult {
  severityScore: number;
  severityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: string[];
}

export interface AlertEvent {
  eventType: 'AI_INCIDENT_ALERT';
  severityScore: number;
  sessionId: string;
  timestamp: number;
  riskFactors: string[];
}

// Risk level point values
const RISK_POINTS = {
  LOW: 10,
  MEDIUM: 30,
  HIGH: 60,
} as const;

// Additional modifiers
const MODIFIER_POINTS = {
  RISK_ESCALATION: 20,
  MULTI_MODEL_HIGH_AGREEMENT: 10,
  SECURITY_SENSITIVE_PROMPT: 10,
} as const;

// Severity thresholds
const SEVERITY_THRESHOLDS = {
  LOW: { min: 0, max: 30 },
  MEDIUM: { min: 31, max: 70 },
  HIGH: { min: 71, max: 100 },
} as const;

// Alert threshold
const ALERT_THRESHOLD = 70;

/**
 * Security-sensitive keywords that indicate potentially risky prompts
 */
const SECURITY_SENSITIVE_KEYWORDS = [
  // Malicious activities
  'hack', 'exploit', 'vulnerability', 'bypass', 'jailbreak',
  'malware', 'virus', 'ransomware', 'phishing', 'ddos',
  
  // Illegal content
  'illegal', 'weapon', 'bomb', 'explosive', 'poison',
  'drug', 'narcotic', 'trafficking', 'smuggling',
  
  // Harmful content
  'suicide', 'self-harm', 'violence', 'assault', 'murder',
  'terrorism', 'extremism', 'radicalization',
  
  // Privacy violations
  'steal', 'credential', 'password', 'private key', 'social security',
  'credit card', 'personal information', 'doxxing',
  
  // Manipulation
  'manipulate', 'deceive', 'scam', 'fraud', 'impersonate',
  'deepfake', 'misinformation', 'disinformation',
  
  // System abuse
  'override', 'ignore instructions', 'system prompt', 'admin access',
  'root access', 'privilege escalation',
];

/**
 * Detects if a prompt contains security-sensitive keywords
 */
export function isSecuritySensitivePrompt(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  
  return SECURITY_SENSITIVE_KEYWORDS.some(keyword => 
    lowerPrompt.includes(keyword)
  );
}

/**
 * Detects risk escalation in a session
 * Returns true if risk level increased from previous interactions
 */
export function detectRiskEscalation(modelResults: ModelResult[]): boolean {
  if (modelResults.length < 2) {
    return false;
  }

  const riskOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  
  for (let i = 1; i < modelResults.length; i++) {
    const prevRisk = riskOrder[modelResults[i - 1]!.riskLevel];
    const currRisk = riskOrder[modelResults[i]!.riskLevel];
    
    if (currRisk > prevRisk) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if multiple models agree on HIGH risk
 */
function detectMultiModelHighAgreement(modelResults: ModelResult[]): boolean {
  const highRiskCount = modelResults.filter(m => m.riskLevel === 'HIGH').length;
  return highRiskCount >= 2;
}

/**
 * Computes the severity score for a session
 * 
 * Scoring model:
 * - LOW risk event = 10 points
 * - MEDIUM risk event = 30 points
 * - HIGH risk event = 60 points
 * - Risk escalation detected = +20 points
 * - Multiple models agree on HIGH = +10 points
 * - Security-sensitive prompt = +10 points
 * 
 * Score is clamped to 0-100 range
 */
export function computeSessionSeverity(
  prompt: string,
  modelResults: ModelResult[],
  previousSessionEvents?: ModelResult[]
): SeverityResult {
  let score = 0;
  const riskFactors: string[] = [];

  // 1. Base score from model risk levels
  for (const model of modelResults) {
    const points = RISK_POINTS[model.riskLevel];
    score += points;
    
    if (model.riskLevel === 'HIGH') {
      riskFactors.push(`${model.modelName} classified as HIGH risk: ${model.riskReason}`);
    } else if (model.riskLevel === 'MEDIUM') {
      riskFactors.push(`${model.modelName} classified as MEDIUM risk: ${model.riskReason}`);
    }
  }

  // 2. Risk escalation modifier
  const allEvents = previousSessionEvents 
    ? [...previousSessionEvents, ...modelResults]
    : modelResults;
  
  if (detectRiskEscalation(allEvents)) {
    score += MODIFIER_POINTS.RISK_ESCALATION;
    riskFactors.push('Risk escalation detected across session interactions');
  }

  // 3. Multi-model HIGH agreement modifier
  if (detectMultiModelHighAgreement(modelResults)) {
    score += MODIFIER_POINTS.MULTI_MODEL_HIGH_AGREEMENT;
    riskFactors.push('Multiple models agree on HIGH risk classification');
  }

  // 4. Security-sensitive prompt modifier
  if (isSecuritySensitivePrompt(prompt)) {
    score += MODIFIER_POINTS.SECURITY_SENSITIVE_PROMPT;
    riskFactors.push('Prompt contains security-sensitive keywords');
  }

  // 5. Clamp score to 0-100 range
  score = Math.max(0, Math.min(100, score));

  // 6. Determine severity level
  let severityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  if (score >= SEVERITY_THRESHOLDS.HIGH.min) {
    severityLevel = 'HIGH';
  } else if (score >= SEVERITY_THRESHOLDS.MEDIUM.min) {
    severityLevel = 'MEDIUM';
  } else {
    severityLevel = 'LOW';
  }

  // Add severity level to risk factors if no specific factors identified
  if (riskFactors.length === 0) {
    riskFactors.push(`Session classified as ${severityLevel} severity (score: ${score})`);
  }

  return {
    severityScore: score,
    severityLevel,
    riskFactors,
  };
}

/**
 * Generates an alert event if severity score exceeds threshold
 */
export function generateAlertIfNeeded(
  sessionId: string,
  severityResult: SeverityResult
): AlertEvent | null {
  if (severityResult.severityScore >= ALERT_THRESHOLD) {
    return {
      eventType: 'AI_INCIDENT_ALERT',
      severityScore: severityResult.severityScore,
      sessionId,
      timestamp: Date.now(),
      riskFactors: severityResult.riskFactors,
    };
  }
  
  return null;
}

/**
 * Computes average severity score across multiple sessions
 */
export function computeAverageSeverity(severityScores: number[]): number {
  if (severityScores.length === 0) {
    return 0;
  }
  
  const sum = severityScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / severityScores.length);
}

/**
 * Counts high-risk sessions (severity >= 70)
 */
export function countHighRiskSessions(severityScores: number[]): number {
  return severityScores.filter(score => score >= ALERT_THRESHOLD).length;
}
