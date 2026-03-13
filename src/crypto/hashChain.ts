import crypto from 'crypto';

export interface AuditEntry {
  id: string;
  timestamp: number;
  sessionId: string;
  eventType: 'prompt' | 'response' | 'risk_assessment' | 'cross_model_analysis';
  data: {
    prompt?: string;
    response?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    riskReason?: string;
    model?: string;
    tokens?: number;
    models?: Array<{
      modelName: string;
      modelId: string;
      response: string;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      riskReason: string;
      tokens: number;
    }>;
    severityScore?: number;
    severityLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    riskFactors?: string[];
  };
  previousHash: string;
  hash: string;
}

export interface AuditEntryInput {
  id: string;
  timestamp: number;
  sessionId: string;
  eventType: 'prompt' | 'response' | 'risk_assessment' | 'cross_model_analysis';
  data: AuditEntry['data'];
}

/**
 * Computes SHA-256 hash of the audit entry
 */
export function computeHash(entry: Omit<AuditEntry, 'hash'>): string {
  // Sort data keys to ensure consistent hashing regardless of property order
  const sortedData: Record<string, unknown> = {};
  Object.keys(entry.data).sort().forEach(key => {
    sortedData[key] = entry.data[key as keyof typeof entry.data];
  });
  
  const content = JSON.stringify({
    id: entry.id,
    timestamp: entry.timestamp,
    sessionId: entry.sessionId,
    eventType: entry.eventType,
    data: sortedData,
    previousHash: entry.previousHash,
  });
  
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Builds a complete audit entry with hash chain
 */
export function buildAuditEntry(
  input: AuditEntryInput,
  previousHash: string = '0'
): AuditEntry {
  const entryWithoutHash: Omit<AuditEntry, 'hash'> = {
    ...input,
    previousHash,
  };
  
  const hash = computeHash(entryWithoutHash);
  
  return {
    ...entryWithoutHash,
    hash,
  };
}

/**
 * Verifies the integrity of the entire hash chain
 */
export function verifyChainIntegrity(entries: AuditEntry[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (entries.length === 0) {
    return { valid: true, errors: [] };
  }
  
  // Check first entry
  if (entries[0]!.previousHash !== '0') {
    errors.push(`First entry should have previousHash '0', got '${entries[0]!.previousHash}'`);
  }
  
  // Verify each entry's hash and chain linkage
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    
    // Recompute hash
    const expectedHash = computeHash({
      id: entry.id,
      timestamp: entry.timestamp,
      sessionId: entry.sessionId,
      eventType: entry.eventType,
      data: entry.data,
      previousHash: entry.previousHash,
    });
    
    if (entry.hash !== expectedHash) {
      errors.push(`Entry ${i} (${entry.id}): Hash mismatch. Expected ${expectedHash}, got ${entry.hash}`);
    }
    
    // Check chain linkage
    if (i > 0) {
      const previousEntry = entries[i - 1]!;
      if (entry.previousHash !== previousEntry.hash) {
        errors.push(`Entry ${i} (${entry.id}): previousHash doesn't match previous entry's hash`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
