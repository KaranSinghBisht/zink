/**
 * RFC-4180 quoting plus spreadsheet-formula neutralization: fields starting
 * with =, +, -, @, tab or CR are prefixed with an apostrophe so Excel/Sheets
 * treat them as text instead of evaluating them.
 */
export function csvField(value: string): string {
  let out = value;
  if (/^[=+\-@\t\r]/.test(out)) {
    out = `'${out}`;
  }
  if (/[",\n\r]/.test(out)) {
    out = `"${out.replace(/"/g, '""')}"`;
  }
  return out;
}
