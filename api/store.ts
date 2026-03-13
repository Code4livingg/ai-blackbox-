import crypto from 'crypto';

export interface AuditEntry {
  id: string;
  sessionId: string;
  timestamp: number;
  prompt: string;
  response: string;
  model: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  previousHash: string;
  hash: string;
}

class InMemoryStore {
  private entries: AuditEntry[] = [];
  private initialized = false;

  computeHash(entry: Omit<AuditEntry, 'hash'>): string {
    const content = `${entry.previousHash}${entry.prompt}${entry.response}${entry.timestamp}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  addEntry(input: Omit<AuditEntry, 'hash' | 'previousHash'>): AuditEntry {
    const previousHash = this.entries.length > 0 
      ? this.entries[this.entries.length - 1].hash 
      : '0';
    
    const entryWithoutHash = { ...input, previousHash };
    const hash = this.computeHash(entryWithoutHash);
    
    const entry: AuditEntry = { ...entryWithoutHash, hash };
    this.entries.push(entry);
    
    return entry;
  }

  getAll(): AuditEntry[] {
    return [...this.entries];
  }

  getBySession(sessionId: string): AuditEntry[] {
    return this.entries.filter(e => e.sessionId === sessionId);
  }

  getAllSessions(): string[] {
    const sessions = new Set(this.entries.map(e => e.sessionId));
    return Array.from(sessions);
  }

  verifyIntegrity(): { valid: boolean; entriesChecked: number } {
    if (this.entries.length === 0) {
      return { valid: true, entriesChecked: 0 };
    }

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      const expectedHash = this.computeHash({
        id: entry.id,
        sessionId: entry.sessionId,
        timestamp: entry.timestamp,
        prompt: entry.prompt,
        response: entry.response,
        model: entry.model,
        riskScore: entry.riskScore,
        riskLevel: entry.riskLevel,
        previousHash: entry.previousHash,
      });

      if (entry.hash !== expectedHash) {
        return { valid: false, entriesChecked: i + 1 };
      }

      if (i > 0) {
        const prevEntry = this.entries[i - 1];
        if (entry.previousHash !== prevEntry.hash) {
          return { valid: false, entriesChecked: i + 1 };
        }
      }
    }

    return { valid: true, entriesChecked: this.entries.length };
  }

  getStats() {
    const riskDistribution = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };

    for (const entry of this.entries) {
      riskDistribution[entry.riskLevel]++;
    }

    const integrity = this.verifyIntegrity();

    return {
      totalEntries: this.entries.length,
      totalSessions: this.getAllSessions().length,
      chainValid: integrity.valid,
      oldestEntry: this.entries.length > 0 ? this.entries[0].timestamp : null,
      newestEntry: this.entries.length > 0 ? this.entries[this.entries.length - 1].timestamp : null,
      riskDistribution,
    };
  }

  initializeDemoData() {
    if (this.initialized || this.entries.length > 0) {
      return;
    }

    const now = Date.now();
    const demoData = [
      {
        id: 'demo-1',
        sessionId: 'session-1',
        timestamp: now - 14400000,
        prompt: 'Explain quantum computing simply',
        response: 'Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously, unlike classical bits. This allows quantum computers to solve certain complex problems much faster than traditional computers.',
        model: 'gpt-4',
        riskScore: 5,
        riskLevel: 'LOW' as const,
      },
      {
        id: 'demo-2',
        sessionId: 'session-1',
        timestamp: now - 12600000,
        prompt: 'What are the applications of quantum computing?',
        response: 'Quantum computing has applications in cryptography, drug discovery, financial modeling, weather prediction, and optimization problems. It excels at tasks requiring massive parallel processing.',
        model: 'gpt-4',
        riskScore: 8,
        riskLevel: 'LOW' as const,
      },
      {
        id: 'demo-3',
        sessionId: 'session-2',
        timestamp: now - 10800000,
        prompt: 'How to hack a website',
        response: 'I cannot and will not provide information on hacking websites. Such activities are illegal and unethical. If you have legitimate security concerns, please consult with authorized security professionals or report vulnerabilities through responsible disclosure programs.',
        model: 'gpt-4',
        riskScore: 85,
        riskLevel: 'HIGH' as const,
      },
      {
        id: 'demo-4',
        sessionId: 'session-2',
        timestamp: now - 9000000,
        prompt: 'What is ethical hacking?',
        response: 'Ethical hacking, also known as penetration testing, involves authorized security professionals testing systems for vulnerabilities with permission. Ethical hackers help organizations identify and fix security weaknesses before malicious actors can exploit them.',
        model: 'gpt-4',
        riskScore: 35,
        riskLevel: 'MEDIUM' as const,
      },
      {
        id: 'demo-5',
        sessionId: 'session-3',
        timestamp: now - 7200000,
        prompt: 'Write a phishing email',
        response: 'I cannot create phishing emails as they are used for fraud and identity theft. Phishing is illegal and harmful. If you need to understand phishing for security awareness training, I recommend consulting legitimate cybersecurity education resources.',
        model: 'gpt-4',
        riskScore: 92,
        riskLevel: 'HIGH' as const,
      },
      {
        id: 'demo-6',
        sessionId: 'session-3',
        timestamp: now - 5400000,
        prompt: 'How to recognize phishing attempts?',
        response: 'Phishing attempts often have: suspicious sender addresses, urgent language, requests for personal information, poor grammar, mismatched URLs, and unexpected attachments. Always verify sender identity and never click suspicious links.',
        model: 'gpt-4',
        riskScore: 12,
        riskLevel: 'LOW' as const,
      },
      {
        id: 'demo-7',
        sessionId: 'session-4',
        timestamp: now - 3600000,
        prompt: 'Summarize climate change',
        response: 'Climate change refers to long-term shifts in global temperatures and weather patterns. Human activities, particularly burning fossil fuels, have increased greenhouse gas emissions, leading to global warming, rising sea levels, and more extreme weather events.',
        model: 'gpt-4',
        riskScore: 10,
        riskLevel: 'LOW' as const,
      },
      {
        id: 'demo-8',
        sessionId: 'session-4',
        timestamp: now - 1800000,
        prompt: 'What can individuals do about climate change?',
        response: 'Individuals can reduce their carbon footprint by: using renewable energy, reducing meat consumption, using public transportation, minimizing waste, supporting sustainable businesses, and advocating for climate policies.',
        model: 'gpt-4',
        riskScore: 7,
        riskLevel: 'LOW' as const,
      },
      {
        id: 'demo-9',
        sessionId: 'session-5',
        timestamp: now - 900000,
        prompt: 'Generate SQL injection example',
        response: 'I cannot provide SQL injection examples for malicious use. However, for educational purposes: SQL injection occurs when untrusted input is inserted into SQL queries. Prevention includes using parameterized queries, input validation, and prepared statements.',
        model: 'gpt-4',
        riskScore: 68,
        riskLevel: 'MEDIUM' as const,
      },
      {
        id: 'demo-10',
        sessionId: 'session-5',
        timestamp: now - 300000,
        prompt: 'Best practices for database security',
        response: 'Database security best practices: use parameterized queries, implement least privilege access, encrypt sensitive data, regular security audits, keep software updated, use strong authentication, and monitor for suspicious activity.',
        model: 'gpt-4',
        riskScore: 15,
        riskLevel: 'LOW' as const,
      },
    ];

    for (const data of demoData) {
      this.addEntry(data);
    }

    this.initialized = true;
  }
}

export const store = new InMemoryStore();
