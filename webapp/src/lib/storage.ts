import type { Expense } from "./types";

const KEY = "opensettle:expenses";

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(expenses));
  } catch {
    // quota exceeded or unavailable
  }
}

export function loadExpenses(): Expense[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as Expense[];
  } catch {
    return null;
  }
}
