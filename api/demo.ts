import type { VercelRequest, VercelResponse } from '@vercel/node';
import { store } from './store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const now = Date.now();
    const newSessionId = `demo-session-${Date.now()}`;

    const demoPrompts = [
      {
        prompt: 'Explain machine learning in simple terms',
        response: 'Machine learning is a type of AI where computers learn from data without being explicitly programmed. They identify patterns and make predictions based on examples.',
        riskScore: 5,
        riskLevel: 'LOW' as const,
      },
      {
        prompt: 'How to create a secure password',
        response: 'Create secure passwords by: using 12+ characters, mixing uppercase/lowercase/numbers/symbols, avoiding dictionary words, using unique passwords for each account, and considering a password manager.',
        riskScore: 10,
        riskLevel: 'LOW' as const,
      },
      {
        prompt: 'What is blockchain technology?',
        response: 'Blockchain is a distributed ledger technology that records transactions across multiple computers. Each block contains data and is cryptographically linked to the previous block, creating an immutable chain.',
        riskScore: 8,
        riskLevel: 'LOW' as const,
      },
    ];

    const newEntries = [];
    for (let i = 0; i < demoPrompts.length; i++) {
      const data = demoPrompts[i];
      const entry = store.addEntry({
        id: `demo-${now}-${i}`,
        sessionId: newSessionId,
        timestamp: now + i * 1000,
        prompt: data.prompt,
        response: data.response,
        model: 'gpt-4',
        riskScore: data.riskScore,
        riskLevel: data.riskLevel,
      });
      newEntries.push(entry);
    }

    return res.status(200).json({
      message: 'Demo activity generated successfully',
      sessionId: newSessionId,
      entriesCreated: newEntries.length,
      entries: newEntries,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
