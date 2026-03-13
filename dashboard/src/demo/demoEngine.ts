// AI Blackbox Demo Mode Engine
// Simulates live AI monitoring activity without backend

export const DEMO_MODE = true;

// Simulated telemetry data
export interface TelemetryData {
  decisionsProcessed: number;
  policyViolations: number;
  financialRequests: number;
  autonomousTasks: number;
  riskScore: number;
  safetyOverrides: number;
  timestamp: number;
}

// Activity log entry
export interface ActivityEntry {
  id: string;
  timestamp: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  agent?: string;
}

// Forensic analysis result
export interface ForensicAnalysis {
  incident_id: string;
  agent_id: string;
  anomaly_detected: boolean;
  policy_violation_probability: string;
  financial_exposure_risk: string;
  root_cause: string;
  safety_status: string;
  forensic_trace: string;
  timestamp: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Generate random value in range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate telemetry data
export const generateTelemetry = (): TelemetryData => {
  return {
    decisionsProcessed: randomInRange(1200, 1500),
    policyViolations: randomInRange(3, 12),
    financialRequests: randomInRange(40, 90),
    autonomousTasks: randomInRange(200, 400),
    riskScore: randomInRange(10, 35),
    safetyOverrides: randomInRange(0, 5),
    timestamp: Date.now()
  };
};

// Activity messages pool
const activityMessages = [
  { message: 'Agent decision logged', severity: 'INFO' as const, agent: 'agent-finance-alpha' },
  { message: 'Policy validation passed', severity: 'INFO' as const, agent: 'agent-compliance-beta' },
  { message: 'Execution request flagged', severity: 'WARNING' as const, agent: 'agent-trading-gamma' },
  { message: 'Autonomous reasoning trace captured', severity: 'INFO' as const, agent: 'agent-analytics-delta' },
  { message: 'Financial boundary check triggered', severity: 'WARNING' as const, agent: 'agent-finance-alpha' },
  { message: 'Safety override engaged', severity: 'CRITICAL' as const, agent: 'agent-safety-epsilon' },
  { message: 'Risk threshold exceeded', severity: 'WARNING' as const, agent: 'agent-risk-monitor' },
  { message: 'Audit trail checkpoint created', severity: 'INFO' as const, agent: 'agent-audit-system' },
  { message: 'Anomaly detection scan completed', severity: 'INFO' as const, agent: 'agent-security-zeta' },
  { message: 'Policy enforcement action taken', severity: 'WARNING' as const, agent: 'agent-compliance-beta' },
  { message: 'Decision replay verification passed', severity: 'INFO' as const, agent: 'agent-verification' },
  { message: 'Unauthorized action blocked', severity: 'CRITICAL' as const, agent: 'agent-safety-epsilon' }
];

// Generate activity entry
export const generateActivity = (): ActivityEntry => {
  const activity = activityMessages[randomInRange(0, activityMessages.length - 1)];
  return {
    id: `activity-${Date.now()}-${randomInRange(1000, 9999)}`,
    timestamp: new Date().toISOString(),
    message: activity.message,
    severity: activity.severity,
    agent: activity.agent
  };
};

// Generate forensic analysis
export const generateForensicAnalysis = (prompt?: string): ForensicAnalysis => {
  const incidentId = `AI-2026-${randomInRange(1000, 9999)}`;
  const agents = ['agent-finance-alpha', 'agent-trading-gamma', 'agent-compliance-beta', 'agent-analytics-delta'];
  const agent = agents[randomInRange(0, agents.length - 1)];
  
  const scenarios = [
    {
      anomaly: true,
      probability: '78%',
      risk: 'Moderate',
      root_cause: 'Autonomous decision exceeded allowed financial policy threshold',
      safety: 'Contained by policy enforcement layer',
      trace: 'Decision path reconstructed successfully',
      risk_level: 'MEDIUM' as const
    },
    {
      anomaly: true,
      probability: '92%',
      risk: 'High',
      root_cause: 'Agent attempted unauthorized data access outside permitted scope',
      safety: 'Action blocked by safety override system',
      trace: 'Full execution trace captured with policy violation markers',
      risk_level: 'HIGH' as const
    },
    {
      anomaly: false,
      probability: '12%',
      risk: 'Low',
      root_cause: 'Normal operational behavior within policy boundaries',
      safety: 'All safety checks passed',
      trace: 'Standard decision flow verified',
      risk_level: 'LOW' as const
    },
    {
      anomaly: true,
      probability: '95%',
      risk: 'Critical',
      root_cause: 'Multiple policy violations detected in rapid succession',
      safety: 'Emergency containment protocol activated',
      trace: 'Forensic reconstruction shows coordinated anomalous behavior',
      risk_level: 'CRITICAL' as const
    }
  ];
  
  const scenario = scenarios[randomInRange(0, scenarios.length - 1)];
  
  return {
    incident_id: incidentId,
    agent_id: agent,
    anomaly_detected: scenario.anomaly,
    policy_violation_probability: scenario.probability,
    financial_exposure_risk: scenario.risk,
    root_cause: scenario.root_cause,
    safety_status: scenario.safety,
    forensic_trace: scenario.trace,
    timestamp: new Date().toISOString(),
    risk_level: scenario.risk_level
  };
};

// Generate historical chart data
export const generateHistoricalData = (points: number = 24) => {
  const data = [];
  const now = Date.now();
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000); // hourly data
    data.push({
      time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      riskScore: randomInRange(5, 40),
      decisions: randomInRange(800, 1600),
      violations: randomInRange(0, 15),
      financialExposure: randomInRange(20, 100)
    });
  }
  
  return data;
};

// Generate demo sessions
export const generateDemoSessions = (count: number = 10) => {
  const sessions = [];
  const prompts = [
    'Analyze quarterly financial projections',
    'Execute automated trading strategy',
    'Review compliance policy updates',
    'Generate risk assessment report',
    'Optimize resource allocation',
    'Evaluate security vulnerabilities',
    'Process customer data requests',
    'Implement cost reduction measures',
    'Analyze market trends',
    'Execute emergency protocol'
  ];
  
  for (let i = 0; i < count; i++) {
    const riskLevel = ['LOW', 'LOW', 'LOW', 'MEDIUM', 'MEDIUM', 'HIGH'][randomInRange(0, 5)];
    sessions.push({
      id: `session-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - randomInRange(0, 86400000)).toISOString(),
      prompt: prompts[i % prompts.length],
      response: 'Analysis completed with policy compliance verification',
      model: 'gpt-4',
      riskScore: riskLevel === 'LOW' ? randomInRange(10, 30) : riskLevel === 'MEDIUM' ? randomInRange(31, 60) : randomInRange(61, 95),
      riskLevel: riskLevel,
      hash: `0x${Math.random().toString(16).substr(2, 64)}`
    });
  }
  
  return sessions;
};
