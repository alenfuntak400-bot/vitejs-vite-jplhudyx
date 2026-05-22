// This file acts as the secure bridge between your frontend and the AI.
// It runs on the server (Vercel) so your API key is never exposed.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Notice we now accept a "type" parameter (either 'image' or 'text')
  const { prompt, type } = req.body;
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error: API key is not configured in Vercel settings or .env file' });
  }

  try {
    let googleUrl = '';
    let payload = {};

    // SMART ROUTING: Choose the right AI model based on what the frontend wants
    if (type === 'image') {
      googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
      payload = {
        instances: { prompt: prompt },
        parameters: { sampleCount: 1 }
      };
    } else {
      // Default to text expansion
      googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      payload = {
        contents: [{ parts: [{ text: prompt }] }]
      };
    }

    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Pass Google's error back to the frontend cleanly if one occurs
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Google API Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to rendering gateway' });
  }
}