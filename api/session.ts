import type { VercelRequest, VercelResponse } from '@vercel/node';
import { store } from './store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize demo data if empty
  store.initializeDemoData();

  if (req.method === 'GET') {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId required' });
    }

    const entries = store.getBySession(sessionId);

    if (entries.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.status(200).json({
      sessionId,
      entries,
      count: entries.length,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
