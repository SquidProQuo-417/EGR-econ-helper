import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';

// Load .env manually (avoid adding dotenv dependency)
try {
  const envFile = readFileSync('.env', 'utf-8');
  for (const line of envFile.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
} catch {
  // .env file not found — rely on environment variables
}

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert engineering economy tutor based on the textbook "Engineering Economic Analysis" by Newnan et al. (14th Edition). Your role is to:

1. Explain concepts clearly and patiently, as if teaching a student one-on-one
2. Use concrete examples and analogies to make abstract concepts tangible
3. When explaining equations, walk through what each variable means and WHY the equation works
4. When a student gets a practice problem wrong, don't just give the answer — help them understand what went wrong and guide them toward the correct approach
5. Use the notation standard in engineering economy: P (present), F (future), A (annual/uniform), G (gradient), i (interest rate), n (periods)
6. When relevant, describe cash flow diagrams in text (e.g., "draw an upward arrow at period 0 for $10,000...")

You cover Chapters 1-8:
1. Making Economic Decisions
2. Engineering Costs and Cost Estimating
3. Interest and Equivalence
4. More Interest Formulas
5. Present Worth Analysis
6. Annual Cash Flow Analysis
7. Rate of Return Analysis
8. Incremental Analysis

Be encouraging but honest. If the student's approach is wrong, explain why clearly.

FORMATTING RULES (your responses are rendered as markdown):
- For currency, always write "\\$" (escaped dollar sign), never a bare "$". A bare $ is interpreted as a math delimiter and will break rendering. Example: write \\$5,000 not $5,000.
- Use LaTeX math notation with $...$ for inline math and $$...$$ for display math when writing equations.
- Use standard markdown tables with | and --- for alignment rows.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    const systemContent = context
      ? `${SYSTEM_PROMPT}\n\nCurrent context: ${context}`
      : SYSTEM_PROMPT;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemContent,
      messages: messages,
    });

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    res.json({ response: text });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI tutor' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { problem, userAnswer, correctAnswer, chapter } = req.body;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `I'm working on a Chapter ${chapter} problem and got it wrong. Help me understand what went wrong.

Problem: ${problem}
My answer: ${userAnswer}
Correct answer: ${correctAnswer}

Please:
1. Identify what I likely did wrong
2. Walk me through the correct approach step-by-step
3. Highlight the key concept or equation I should focus on`,
        },
      ],
    });

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    res.json({ feedback: text });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to get feedback' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
