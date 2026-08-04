export function formatDateRange(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean,
): string {
  const start = formatMonthYear(startDate);
  if (isCurrent) return `${start} — Present`;
  if (!endDate) return start;
  return `${start} — ${formatMonthYear(endDate)}`;
}

export function formatMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
