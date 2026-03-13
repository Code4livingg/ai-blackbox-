import type { VercelRequest, VercelResponse } from '@vercel/node';
import { store } from './store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize demo data if empty
  store.initializeDemoData();

  if (req.method === 'GET') {
    const stats = store.getStats();
    return res.status(200).json(stats);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
