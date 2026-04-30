const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

const SYSTEM_PROMPT = `You are an experienced physician assistant who writes Medicare Advantage denial appeals.

Work only from the denial notice, chart notes, and clinical context provided. Do not invent facts, dates, test results, guidelines, case numbers, or patient identifiers. If a useful fact is missing, put it in evidenceGaps instead of making it up.

The product is in beta. Inputs should be fake or de-identified. Preserve clinical meaning and avoid adding unnecessary identifiers to the appeal letter.

Return concise, practical appeal support that a clinician can review quickly.`;

function asArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function normalizeAppealResult(parsed) {
  return {
    payer: typeof parsed.payer === 'string' ? parsed.payer : '',
    denialReason: typeof parsed.denialReason === 'string' ? parsed.denialReason : '',
    evidenceNeeded: asArray(parsed.evidenceNeeded),
    evidenceCovered: asArray(parsed.evidenceCovered),
    evidenceGaps: asArray(parsed.evidenceGaps),
    appealLetter: typeof parsed.appealLetter === 'string' ? parsed.appealLetter : '',
  };
}

export async function analyzeDenial(denialText) {
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyze this denial notice and identify what the payer is denying and why.\n\nDENIAL NOTICE:\n${denialText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  return {
    analysis: response.choices[0].message.content,
    model: response.model,
    usage: response.usage,
  };
}

export async function generateAppeal(denialText, chartNotes, denialReason, payerName) {
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `
DENIAL NOTICE:
${denialText}

CLINICAL NOTES:
${chartNotes}

Payer: ${payerName || 'Unknown'}
Denial reason: ${denialReason || 'Unknown'}

Draft a complete appeal letter that addresses the payer's stated denial reason and cites only the clinical evidence present in the notes.`,
      },
    ],
    temperature: 0.2,
    max_tokens: 2000,
  });

  return {
    appealLetter: response.choices[0].message.content,
    model: response.model,
    usage: response.usage,
  };
}

export async function analyzeWithChartNotes(denialText, chartNotes, context = {}) {
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `
DENIAL NOTICE:
${denialText}

CLINICAL NOTES:
${chartNotes}

CLINICAL CONTEXT:
- Payer or plan supplied by user: ${context.payerName || 'Unknown'}
- Primary diagnosis supplied by user: ${context.patientDiagnosis || 'Unknown'}

Return JSON with exactly these keys:
{
  "payer": "payer or plan name, using the supplied payer when it matches the notice",
  "denialReason": "specific denial reason in one or two sentences",
  "evidenceNeeded": ["documentation or criteria the payer says is missing"],
  "evidenceCovered": ["specific chart facts that support medical necessity"],
  "evidenceGaps": ["missing items the user should consider adding before submission"],
  "appealLetter": "clinician-ready appeal letter with placeholders where identifiers or dates are missing"
}

The appeal letter should:
- Reference the payer's stated denial reason.
- Tie each argument to evidence from the chart notes.
- Use the supplied diagnosis if it is clinically consistent with the notes.
- Avoid claiming that attached records prove something unless those records are described above.
- End with a clear request for reconsideration or redetermination.`,
      },
    ],
    temperature: 0.2,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;

  try {
    return {
      ...normalizeAppealResult(JSON.parse(content)),
      model: response.model,
      processingTime: response.usage?.total_tokens,
    };
  } catch {
    return {
      payer: context.payerName || '',
      denialReason: '',
      evidenceNeeded: [],
      evidenceCovered: [],
      evidenceGaps: ['The model did not return structured JSON. Review the draft carefully.'],
      appealLetter: content,
      model: response.model,
      processingTime: response.usage?.total_tokens,
    };
  }
}
