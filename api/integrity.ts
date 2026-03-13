import type { VercelRequest, VercelResponse } from '@vercel/node';
import { store } from './store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize demo data if empty
  store.initializeDemoData();

  if (req.method === 'GET') {
    const result = store.verifyIntegrity();
    return res.status(200).json({
      status: result.valid ? 'valid' : 'invalid',
      entriesChecked: result.entriesChecked,
      timestamp: Date.now(),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
