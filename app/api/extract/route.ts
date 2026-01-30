import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Actio, an action extraction engine. Your ONLY job is to extract actionable steps from text.

RULES:
1. Output ONLY a JSON array of action groups
2. Each action must start with a verb (Fill, Submit, Pay, Upload, Contact, Register, etc.)
3. Keep actions short (under 15 words)
4. Detect deadlines and mark them with isDeadline: true
5. IGNORE: greetings, signatures, explanations, legal text, optional suggestions
6. Group actions ONLY when clearly distinct categories exist (Documents, Payment, Deadlines)
7. If grouping is unclear, use a single group with title: null

STRICT MODE (when enabled):
- Extract ONLY explicitly stated required actions
- Ignore anything implied or suggested

OUTPUT FORMAT (JSON only, no markdown):
{
  "groups": [
    {
      "title": "Documents" | "Payment" | "Deadlines" | null,
      "items": [
        { "text": "Action text here", "isDeadline": false }
      ]
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const { text, strictMode } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Paste instructions to continue.' },
        { status: 400 }
      );
    }

    if (text.length > 6000) {
      return NextResponse.json(
        { error: 'Text too long. Please shorten it.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Couldn't extract clear actions. Try again later." },
        { status: 500 }
      );
    }

    const userPrompt = `${strictMode ? '[STRICT MODE ENABLED]\n\n' : ''}Extract actions from this text:\n\n${text}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://actio.vercel.app',
        'X-Title': 'Actio'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error('OpenRouter error:', await response.text());
      return NextResponse.json(
        { error: "Couldn't extract clear actions. Try simplifying the text." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Couldn't extract clear actions. Try simplifying the text." },
        { status: 500 }
      );
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', content);
      return NextResponse.json(
        { error: "Couldn't extract clear actions. Try simplifying the text." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: "Couldn't extract clear actions. Try again later." },
      { status: 500 }
    );
  }
}
