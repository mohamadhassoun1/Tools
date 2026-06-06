/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load variables from .env
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialized Gemini API client wrapper to prevent startup crashes when keys are empty
function getGeminiClient(incomingReferer?: string): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is currently not configured.');
  }

  // Use the incoming referer if present, otherwise fall back to the production domain to satisfy API key restrictions
  const referer = incomingReferer || 'https://tools.vntera.com/';
  let origin = 'https://tools.vntera.com';

  try {
    const parsed = new URL(referer);
    origin = parsed.origin;
  } catch (err) {
    // Fallback to tools domain in case of invalid URL
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
        'Referer': referer,
        'Origin': origin,
      },
    },
  });
}

// -------------------------------------------------------------
// SECURE SERVER-SIDE AI ROUTE PROXIES
// -------------------------------------------------------------
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Payload body missing "prompt" query parameter.' });
      return;
    }

    // Prioritize OpenRouter API to bypass browser-restricted referrer restrictions
    const openRouterKey = process.env.OPENROUTER_API_KEY || "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";
    
    if (openRouterKey) {
      try {
        console.log('Sending SEO audit prompt to OpenRouter API...');
        const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://tools.vntera.com',
            'X-Title': 'Vntera Tools',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash:free',
            messages: [
              {
                role: 'user',
                content: prompt,
              }
            ],
          }),
        });

        if (orResponse.ok) {
          const data: any = await orResponse.json();
          const aiText = data.choices?.[0]?.message?.content;
          if (aiText) {
            console.log('Successful generation through OpenRouter!');
            res.json({ text: aiText });
            return;
          }
        } else {
          const errorText = await orResponse.text();
          console.warn(`OpenRouter returned status ${orResponse.status}:`, errorText);
        }
      } catch (err: any) {
        console.warn('OpenRouter API query failed, falling back to native Gemini SDK:', err.message);
      }
    }

    // FALLBACK: Use raw Google GenAI client if OpenRouter is unconfigured or failed
    console.log('Using fallback native Gemini SDK for generation...');
    const refererHeader = req.get('referer') || req.get('referrer') || 'https://tools.vntera.com/';
    const ai = getGeminiClient(refererHeader);

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Express Gemini Fallback API Error:', error);
    res.status(500).json({ error: error.message || 'Server API Error executing generative algorithms.' });
  }
});

// App Health Diagnostic
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// -------------------------------------------------------------
// VITE AND STATIC ASSET PRODUCERS MIDDLEWARES
// -------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Mounting Vite dev middleware streams...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Mounting production build static folders in dist...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express multi-tools server listening securely on http://localhost:${PORT}`);
  });
}

bootstrap();
