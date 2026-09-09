// Preserve the existing server-local calendar semantics; never mutate the input.
export function addDays(date: Date, days: number): Date {
  const copied = new Date(date);
  copied.setDate(copied.getDate() + days);
  return copied;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`;
}
