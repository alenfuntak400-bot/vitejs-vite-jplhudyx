// This file acts as the secure bridge between your frontend and the AI.
// It runs on the server (Vercel) so your API key is never exposed.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, type } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error: API key is not configured in Vercel settings' });
  }

  try {
    // We use a unified endpoint pattern for Gemini models
    const model = type === 'image' ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Prepare the payload according to the generateContent standard
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      // If it's an image request, we specifically ask the model to return image modality
      ...(type === 'image' && {
        generationConfig: {
          responseModalities: ['IMAGE'],
        },
      }),
    };

    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Google API Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to rendering gateway' });
  }
}