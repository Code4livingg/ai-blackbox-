import { type AuditEntry } from '../crypto/hashChain.js';

export interface ReplayEvent {
  id: string;
  timestamp: number;
  eventType: string;
  data: AuditEntry['data'];
  durationSincePrevious: number | null;
}

export interface ReplayTimeline {
  sessionId: string;
  events: ReplayEvent[];
  totalDuration: number;
  riskEscalation: {
    detected: boolean;
    escalations: Array<{
      from: string;
      to: string;
      timestamp: number;
    }>;
  };
  summary: {
    totalEvents: number;
    promptCount: number;
    responseCount: number;
    riskAssessmentCount: number;
    finalRiskLevel: string | null;
    averageEventInterval: number;
  };
}

/**
 * Reconstructs a forensic timeline from session audit entries
 */
export function reconstructTimeline(entries: AuditEntry[]): ReplayTimeline {
  if (entries.length === 0) {
    throw new Error('Cannot reconstruct timeline from empty entries');
  }

  const sessionId = entries[0]!.sessionId;
  const events: ReplayEvent[] = [];
  const escalations: Array<{ from: string; to: string; timestamp: number }> = [];
  
  let previousTimestamp: number | null = null;
  let previousRiskLevel: string | null = null;
  
  let promptCount = 0;
  let responseCount = 0;
  let riskAssessmentCount = 0;
  let finalRiskLevel: string | null = null;

  for (const entry of entries) {
    const durationSincePrevious = previousTimestamp !== null 
      ? entry.timestamp - previousTimestamp 
      : null;

    events.push({
      id: entry.id,
      timestamp: entry.timestamp,
      eventType: entry.eventType,
      data: entry.data,
      durationSincePrevious,
    });

    // Track event types
    if (entry.eventType === 'prompt') promptCount++;
    if (entry.eventType === 'response') responseCount++;
    if (entry.eventType === 'risk_assessment') riskAssessmentCount++;

    // Detect risk escalation
    if (entry.data.riskLevel) {
      finalRiskLevel = entry.data.riskLevel;
      
      if (previousRiskLevel && previousRiskLevel !== entry.data.riskLevel) {
        const riskOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
        const prevLevel = riskOrder[previousRiskLevel as keyof typeof riskOrder] || 0;
        const currLevel = riskOrder[entry.data.riskLevel as keyof typeof riskOrder] || 0;
        
        if (currLevel > prevLevel) {
          escalations.push({
            from: previousRiskLevel,
            to: entry.data.riskLevel,
            timestamp: entry.timestamp,
          });
        }
      }
      
      previousRiskLevel = entry.data.riskLevel;
    }

    previousTimestamp = entry.timestamp;
  }

  const totalDuration = entries.length > 1 
    ? entries[entries.length - 1]!.timestamp - entries[0]!.timestamp 
    : 0;

  const averageEventInterval = events.length > 1
    ? totalDuration / (events.length - 1)
    : 0;

  return {
    sessionId,
    events,
    totalDuration,
    riskEscalation: {
      detected: escalations.length > 0,
      escalations,
    },
    summary: {
      totalEvents: events.length,
      promptCount,
      responseCount,
      riskAssessmentCount,
      finalRiskLevel,
      averageEventInterval,
    },
  };
}
