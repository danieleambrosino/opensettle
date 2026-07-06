import type { Expense, Obligation, PersonID } from "./types";

export function splitExpenses(expenses: Expense[]): Obligation[] {
  return expenses.flatMap((e) => splitExpense(e));
}

function splitExpense(expense: Expense): Obligation[] {
  const total = expense.amount;
  let remaining = total;

  const shares = new Map<PersonID, number>();
  const participantsWithEqualShares = new Set<PersonID>();

  for (const participant of expense.participants) {
    if (participant.amount === null) {
      participantsWithEqualShares.add(participant.person);
    } else {
      const share = Math.min(participant.amount, remaining);
      shares.set(
        participant.person,
        (shares.get(participant.person) || 0) + share
      );
      remaining -= share;
    }
  }

  const m = participantsWithEqualShares.size;
  if (m > 0) {
    const eq = Math.floor(remaining / m);
    let rem = remaining % m;
    for (const p of participantsWithEqualShares) {
      let extra = 0;
      if (rem > 0) {
        extra = 1;
        rem -= 1;
      }
      shares.set(p, eq + extra);
    }
  }

  return shares
    .entries()
    .filter(([p, s]) => p !== expense.payer && s !== 0)
    .map(([p, s]) => ({
      amount: s,
      from: p,
      to: expense.payer,
    }))
    .toArray();
}
