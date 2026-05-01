/**
 * Deterministic text scrubbing for denial notices and clinical snippets.
 * Reduces risk from common identifiers; does not satisfy HIPAA Safe Harbor.
 * Pure string transforms — safe to import from client or server bundles.
 */

/** @typedef {Record<string, number>} ReplacementCounts */

export const SCRUB_LABEL =
  'Scripted placeholders replace common identifier patterns. Review scrubbed text before generating. This is not guaranteed HIPAA de-identification.';

function emptyCounts() {
  return /** @type {ReplacementCounts} */ ({});
}

/**
 * @param {string} text
 * @param {RegExp} regex
 * @param {string} placeholder
 * @param {ReplacementCounts} counts
 * @param {string} categoryKey
 */
function replaceAll(text, regex, placeholder, counts, categoryKey) {
  let hits = 0;
  const next = text.replace(regex, () => {
    hits += 1;
    return placeholder;
  });
  if (hits > 0) {
    counts[categoryKey] = (counts[categoryKey] || 0) + hits;
  }
  return next;
}

/**
 * @param {string} input
 * @returns {{ text: string, byCategory: ReplacementCounts, totalReplacements: number }}
 */
export function scrubClinicalText(input) {
  if (typeof input !== 'string' || input.length === 0) {
    return { text: '', byCategory: emptyCounts(), totalReplacements: 0 };
  }

  let text = input;
  const byCategory = emptyCounts();

  const steps = [
    // URLs first so nested emails/hostnames do not leak fragments
    [/https?:\/\/[^\s<>"'[\]()]+/gi, '[URL]', 'url'],
    [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi,
      '[EMAIL]',
      'email',
    ],
    [
      /\b(?:(?:25[0-5]|2[0-4]\d|1?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|1?\d{1,2})\b/g,
      '[IP]',
      'ip',
    ],
    [/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, '[SSN]', 'ssn'],
    [
      /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g,
      '[PHONE]',
      'phone',
    ],
    [
      /\b(?:Fax|Facsimile)\s*[:#]?\s*(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/gi,
      '[FAX]',
      'fax',
    ],
    [
      /(?:\b(?:DOB|D\.?O\.?B\.?|Date\s+of\s+birth)\s*[:#\-]?\s*)(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/gi,
      '[DOB]',
      'dob',
    ],
    [
      /\b(?:MRN|Medical\s+Record(?:\s+Number)?)\s*[:#]?\s*[A-Za-z0-9][A-Za-z0-9\-]{3,24}\b/gi,
      '[MRN]',
      'mrn',
    ],
    [
      /\b(?:Member\s*(?:ID|#|Number)|Subscriber\s*(?:ID|#|Number))\s*[:#]?\s*[A-Za-z0-9][A-Za-z0-9\-]{4,24}\b/gi,
      '[MEMBER_ID]',
      'memberId',
    ],
    [
      /\b(?:Group|Grp\.?)\s*(?:#|Number|ID)\s*[:#]?\s*[A-Za-z0-9][A-Za-z0-9\-]{3,22}\b/gi,
      '[GROUP_ID]',
      'groupId',
    ],
    [
      /\b(?:Prior\s+Auth|Pre[- ]?authorization|Authorization\s*(?:#|Number|Ref(?:erence)?))\s*[:#]?\s*[A-Za-z0-9][A-Za-z0-9\-]{4,26}\b/gi,
      '[AUTH_REF]',
      'authRef',
    ],
    [
      /\b(?:NPI|National\s+Provider\s+(?:ID|Identifier))\s*[:#.\s]*\d{10}\b/gi,
      '[NPI]',
      'npi',
    ],
    [
      /\b(?:Claim\s*(?:#|Number|No\.?)|Claim\s+ID)\s*[:#]?\s*[A-Za-z0-9][A-Za-z0-9\-]{5,32}\b/gi,
      '[CLAIM_NUMBER]',
      'claimNumber',
    ],
    [
      /\b(?:Policy\s*(?:#|Number)|Policy\s+ID)\s*[:#]?\s*[A-Za-z0-9][A-Za-z0-9\-]{4,28}\b/gi,
      '[POLICY_NUMBER]',
      'policyNumber',
    ],
    [
      /\b(?:Account\s*(?:#|Number))\s*[:#]?\s*[A-Za-z0-9][A-Za-z0-9\-]{4,28}\b/gi,
      '[ACCOUNT_NUMBER]',
      'accountNumber',
    ],
    [
      /(?:Patient\s*Name|Pt\.?\s*Name|Member\s*Name|Subscriber\s*Name)\s*:\s*[^\n\r]+/gi,
      '[PATIENT_NAME_LINE]',
      'patientNameLabeled',
    ],
    [
      /\b\d{1,5}\s+[NWES]?\s*[A-Za-z0-9.'\-]+(?:\s+[A-Za-z0-9.'\-]+){0,4}\s+(?:Street|St\.|Avenue|Ave\.|Road|Rd\.|Boulevard|Blvd\.|Drive|Dr\.|Lane|Ln\.|Court|Ct\.|Way)\b(?:\s*,\s*[A-Za-z][A-Za-z\s]*,?)?/gi,
      '[ADDRESS]',
      'address',
    ],
  ];

  for (const [regex, placeholder, key] of steps) {
    text = replaceAll(text, regex, placeholder, byCategory, key);
  }

  const totalReplacements = Object.values(byCategory).reduce((n, v) => n + v, 0);
  return { text, byCategory, totalReplacements };
}

function sumCounts(...objects) {
  const out = emptyCounts();
  for (const obj of objects) {
    if (!obj) continue;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'number' && v > 0) {
        out[k] = (out[k] || 0) + v;
      }
    }
  }
  return out;
}

/**
 * Scrub all fields that flow into the appeal generator.
 * @param {{ denialText?: string, chartNotes?: string, patientDiagnosis?: string, payerName?: string }} fields
 */
export function scrubAppealInputs(fields) {
  const denial = scrubClinicalText(fields.denialText || '');
  const chart = scrubClinicalText(fields.chartNotes || '');
  const diag = scrubClinicalText(fields.patientDiagnosis || '');
  const payer = scrubClinicalText(fields.payerName || '');

  const totalReplacements =
    denial.totalReplacements +
    chart.totalReplacements +
    diag.totalReplacements +
    payer.totalReplacements;

  return {
    denialText: denial.text.trim(),
    chartNotes: chart.text.trim(),
    patientDiagnosis: diag.text.trim(),
    payerName: payer.text.trim(),
    stats: {
      fields: {
        denialText: denial.byCategory,
        chartNotes: chart.byCategory,
        patientDiagnosis: diag.byCategory,
        payerName: payer.byCategory,
      },
      byCategory: sumCounts(
        denial.byCategory,
        chart.byCategory,
        diag.byCategory,
        payer.byCategory,
      ),
      totalReplacements,
    },
  };
}
