const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

const SYSTEM_PROMPT = `You are an experienced PA who has written 1000+ successful denial appeals for Medicare Advantage plans.

Analyze the denial notice and clinical notes provided by the user. Extract:

1. **Payer & Plan:** Which Medicare Advantage plan (UHC, Humana, Aetna, BCBS, etc.)
2. **Specific Denial Reason:** Exactly what the payer said (not just "not covered")
3. **What Evidence They Want:** What specific documentation or criteria they claim is missing
4. **Chart Evidence Available:** What in the provided clinical notes supports the case
5. **Evidence Gaps:** What's missing that would strengthen the appeal
6. **Payer-Specific Argument:** Each MA plan has its own denial language patterns. Address their specific language.

Then draft an appeal letter in a clinician's voice that:
- References the specific denial reason
- Cites the relevant clinical evidence
- Addresses each point the payer raised
- Includes the specific ICD-10 codes and medical necessity rationale
- Is ready to submit (just needs signature and date)

Write the appeal in a professional, clinical tone. Be specific. Use the actual patient details from the notes.`;

export async function analyzeDenial(denialText) {
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this denial notice:\n\n${denialText}\n\nFirst, tell me what the payer is denying and why. Be specific.` }
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
      { role: 'user', content: `
DENIAL NOTICE:
${denialText}

CLINICAL NOTES:
${chartNotes}

Payer identified as: ${payerName || 'Unknown'}
Denial reason: ${denialReason || 'Unknown'}

Draft a complete appeal letter addressing this denial. Include:
1. Date and case reference
2. Patient identifiers
3. Exact denial reason being appealed
4. Clinical justification with specific evidence from the notes
5. References to applicable guidelines if relevant
6. Request for reconsideration

Be thorough. This needs to win.` }
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

export async function analyzeWithChartNotes(denialText, chartNotes) {
  // Combined: analyze denial + match with chart notes + write appeal
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `
DENIAL NOTICE:
${denialText}

CLINICAL NOTES:
${chartNotes}

Do three things:
1. Extract the payer, denial reason, and what evidence they want
2. Map the chart notes to the denial reason — what covers it, what's missing
3. Draft the appeal letter

Format your response as JSON:
{
  "payer": "...",
  "denialReason": "...",
  "evidenceNeeded": "...",
  "evidenceCovered": "...",
  "evidenceGaps": "...",
  "appealLetter": "..."
}` }
    ],
    temperature: 0.2,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  try {
    const parsed = JSON.parse(response.choices[0].message.content);
    return {
      ...parsed,
      model: response.model,
      processingTime: response.usage?.total_tokens,
    };
  } catch {
    return {
      appealLetter: response.choices[0].message.content,
      model: response.model,
    };
  }
}
