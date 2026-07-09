/** All dates in this app are UTC calendar dates, formatted YYYY-MM-DD. */

export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayDateString(): string {
  return toDateString(new Date());
}

export function previousDateString(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return toDateString(date);
}

export function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

export function formatDateLong(dateString: string): string {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
