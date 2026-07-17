export function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function toCsv(rows: Record<string, unknown>[], columns: readonly string[]): string {
  const header = columns.map(csvEscape).join(',');
  const body = rows.map((row) => columns.map((col) => csvEscape(row[col])).join(','));
  return [header, ...body].join('\r\n') + '\r\n';
}
