export function extractJson(input: string): any {
  // 1) strip code fences
  const stripped = input
    .replace(/^```(json)?/gim, '')
    .replace(/```$/gim, '')
    .trim();

  // 2) fast path
  try { return JSON.parse(stripped); } catch {}

  // 3) scan first balanced {...}
  const s = stripped;
  let depth = 0, start = -1;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') { if (depth === 0) start = i; depth++; }
    else if (ch === '}') { depth--; if (depth === 0 && start !== -1) {
      const candidate = s.slice(start, i + 1);
      try { return JSON.parse(candidate); } catch {}
    }}
  }
  throw new Error('No valid JSON block found');
}

export type CaseSchema = {
  case: {
    id: string;
    age: number; sex: 'M'|'F';
    chiefComplaint: string;
    history: string[];
    vitals?: Record<string,string|number>;
  };
};

export function isCaseSchema(x: any): x is CaseSchema {
  return x && x.case && typeof x.case.id === 'string' && typeof x.case.age === 'number';
}
