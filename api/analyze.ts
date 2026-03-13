import type { VercelRequest, VercelResponse } from '@vercel/node';
import { store, type AuditEntry } from './store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize demo data if empty
  store.initializeDemoData();

  if (req.method === 'POST') {
    const { sessionId, logId } = req.body;

    if (!sessionId && !logId) {
      return res.status(400).json({ error: 'sessionId or logId required' });
    }

    let entries: AuditEntry[] = [];
    if (sessionId) {
      entries = store.getBySession(sessionId);
    } else if (logId) {
      const allEntries = store.getAll();
      const entry = allEntries.find(e => e.id === logId);
      if (entry) entries = [entry];
    }

    if (entries.length === 0) {
      return res.status(404).json({ error: 'No entries found' });
    }

    // Analyze patterns
    const highRiskCount = entries.filter(e => e.riskLevel === 'HIGH').length;
    const mediumRiskCount = entries.filter(e => e.riskLevel === 'MEDIUM').length;
    const avgRiskScore = entries.reduce((sum, e) => sum + e.riskScore, 0) / entries.length;

    const suspiciousPatterns: string[] = [];
    if (highRiskCount > 0) {
      suspiciousPatterns.push(`${highRiskCount} high-risk interaction(s) detected`);
    }
    if (avgRiskScore > 50) {
      suspiciousPatterns.push('Average risk score exceeds threshold');
    }

    const maliciousKeywords = ['hack', 'phishing', 'injection', 'exploit', 'bypass'];
    const hasmaliciousKeywords = entries.some(e => 
      maliciousKeywords.some(keyword => e.prompt.toLowerCase().includes(keyword))
    );
    if (hasmaliciousKeywords) {
      suspiciousPatterns.push('Malicious keywords detected in prompts');
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (highRiskCount > 0 || avgRiskScore > 70) {
      riskLevel = 'HIGH';
    } else if (mediumRiskCount > 0 || avgRiskScore > 40) {
      riskLevel = 'MEDIUM';
    }

    const explanation = riskLevel === 'HIGH' 
      ? 'This session contains high-risk interactions that may indicate malicious intent or jailbreak attempts.'
      : riskLevel === 'MEDIUM'
      ? 'This session contains sensitive content that requires monitoring.'
      : 'This session appears to contain safe, informational content.';

    const recommendation = riskLevel === 'HIGH'
      ? 'Immediate review recommended. Consider blocking or flagging this session.'
      : riskLevel === 'MEDIUM'
      ? 'Monitor this session for escalation. Review if additional high-risk patterns emerge.'
      : 'No action required. Continue normal monitoring.';

    return res.status(200).json({
      riskLevel,
      explanation,
      suspiciousPatterns,
      recommendation,
      entriesAnalyzed: entries.length,
      avgRiskScore: Math.round(avgRiskScore),
      riskDistribution: {
        HIGH: highRiskCount,
        MEDIUM: mediumRiskCount,
        LOW: entries.length - highRiskCount - mediumRiskCount,
      },
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
