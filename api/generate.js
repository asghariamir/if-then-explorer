export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const backendResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error('Google API Error:', data);
      return response.status(backendResponse.status).json(data);
    }

    return response.status(200).json(data);
  } catch (error) {
    console.error('Internal Server Error:', error);
    return response.status(500).json({ error: 'Failed to fetch from Google API' });
  }
}
