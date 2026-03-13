import type { VercelRequest, VercelResponse } from '@vercel/node';
import { store } from './store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize demo data if empty
  store.initializeDemoData();

  if (req.method === 'GET') {
    const sessions = store.getAllSessions();
    return res.status(200).json({ sessions, count: sessions.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
