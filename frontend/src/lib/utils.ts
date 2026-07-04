const colors = [
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
];

export function personColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const eur = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

export function fmt(cents: number): string {
  return eur.format(cents / 100);
}
