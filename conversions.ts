import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // For static deployment, we'll return an empty array
    // In a real deployment, you'd connect to a database here
    res.json({ conversions: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversions" });
  }
}