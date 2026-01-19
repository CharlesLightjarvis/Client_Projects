import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chat, toServerSentEventsResponse } from '@tanstack/ai';
import { geminiText } from '@tanstack/ai-gemini';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Create a streaming chat response with Gemini
    const stream = chat({
      adapter: geminiText('gemini-2.5-flash'),
      messages,
    });

    // Convert to SSE response for the client
    const sseResponse = toServerSentEventsResponse(stream);

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the SSE stream to the response
    const reader = sseResponse.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      res.end();
    } catch (error) {
      console.error('Stream error:', error);
      res.end();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Chat endpoint: http://localhost:${PORT}/api/chat`);
});
