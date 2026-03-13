import { type AuditEntry, type AuditEntryInput, buildAuditEntry, verifyChainIntegrity } from '../crypto/hashChain.js';

class LogStore {
  private entries: AuditEntry[] = [];
  private sessionIndex: Map<string, AuditEntry[]> = new Map();

  /**
   * Appends a new audit entry to the chain
   */
  append(input: AuditEntryInput): AuditEntry {
    const previousHash = this.entries.length > 0 
      ? this.entries[this.entries.length - 1]!.hash 
      : '0';
    
    const entry = buildAuditEntry(input, previousHash);
    
    this.entries.push(entry);
    
    // Update session index
    const sessionEntries = this.sessionIndex.get(entry.sessionId) || [];
    sessionEntries.push(entry);
    this.sessionIndex.set(entry.sessionId, sessionEntries);
    
    return entry;
  }

  /**
   * Gets all entries for a specific session
   */
  getBySession(sessionId: string): AuditEntry[] {
    return this.sessionIndex.get(sessionId) || [];
  }

  /**
   * Gets all audit entries
   */
  getAll(): AuditEntry[] {
    return [...this.entries];
  }

  /**
   * Gets all session IDs
   */
  getAllSessions(): string[] {
    return Array.from(this.sessionIndex.keys());
  }

  /**
   * Verifies the integrity of the entire chain
   */
  verifyIntegrity(): { valid: boolean; errors: string[] } {
    return verifyChainIntegrity(this.entries);
  }

  /**
   * Gets statistics about the log store
   */
  getStats(): {
    totalEntries: number;
    totalSessions: number;
    chainValid: boolean;
    oldestEntry: number | null;
    newestEntry: number | null;
    riskDistribution: {
      LOW: number;
      MEDIUM: number;
      HIGH: number;
    };
  } {
    const integrity = this.verifyIntegrity();
    
    const riskDistribution = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };
    
    for (const entry of this.entries) {
      if (entry.data.riskLevel) {
        riskDistribution[entry.data.riskLevel]++;
      }
    }
    
    return {
      totalEntries: this.entries.length,
      totalSessions: this.sessionIndex.size,
      chainValid: integrity.valid,
      oldestEntry: this.entries.length > 0 ? this.entries[0]!.timestamp : null,
      newestEntry: this.entries.length > 0 ? this.entries[this.entries.length - 1]!.timestamp : null,
      riskDistribution,
    };
  }
}

// Singleton instance
export const logStore = new LogStore();
