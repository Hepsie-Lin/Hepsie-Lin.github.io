export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, model, max_tokens } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API 错误:', errorData);
      return res.status(response.status).json({ error: errorData.error || 'OpenRouter API 错误' });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('调用 OpenRouter API 失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}
