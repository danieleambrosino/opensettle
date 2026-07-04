// place files you want to import through the `$lib` alias in this folder.

import type {
  Balance,
  Cents,
  Expense,
  Obligation,
  PersonID,
  Settlement,
} from "./types";

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
    const eq = remaining / m;
    let rem = remaining % m;
    for (const p of participantsWithEqualShares) {
      let extra = 0;
      if (rem > 0) {
        extra = 1;
        rem--;
      }
      shares.set(p, eq + extra);
    }
  }

  return shares
    .entries()
    .filter(([p, s]) => p !== expense.payer && s !== 0)
    .map(([p, s]) => ({
      from: p,
      to: expense.payer,
      amount: s,
    }))
    .toArray();
}

export function computeBalances(obligations: Obligation[]): Balance[] {
  const balancesMap = new Map<PersonID, Cents>();
  for (const o of obligations) {
    balancesMap.set(o.to, (balancesMap.get(o.to) || 0) + o.amount);
    balancesMap.set(o.from, (balancesMap.get(o.from) || 0) - o.amount);
  }
  return balancesMap
    .entries()
    .map(([id, amt]) => ({ person: id, amount: amt }))
    .toArray()
    .toSorted((a, b) => {
      if (a.amount === b.amount) {
        if (a.person === b.person) {
          return 0;
        }
        if (a.person < b.person) {
          return -1;
        }
        return 1;
      }
      if (a.amount < b.amount) {
        return -1;
      }
      return 1;
    });
}

class MaxHeap {
  private readonly data: Balance[] = [];

  get length(): number {
    return this.data.length;
  }

  push(val: Balance): void {
    this.data.push(val);
    this._siftUp(this.data.length - 1);
  }

  pop(): Balance {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  private _siftUp(idx: number): void {
    while (idx > 0) {
      const parent = (idx - 1) >> 1;
      if (this.data[parent].amount >= this.data[idx].amount) {
        break;
      }
      [this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]];
      idx = parent;
    }
  }

  private _siftDown(idx: number): void {
    const n = this.data.length;
    while (true) {
      let largest = idx;
      const left = (idx << 1) + 1;
      const right = left + 1;
      if (left < n && this.data[left].amount > this.data[largest].amount) {
        largest = left;
      }
      if (right < n && this.data[right].amount > this.data[largest].amount) {
        largest = right;
      }
      if (largest === idx) {
        break;
      }
      [this.data[idx], this.data[largest]] = [
        this.data[largest],
        this.data[idx],
      ];
      idx = largest;
    }
  }
}

export function computeMinimalSettlementSet(balances: Balance[]): Settlement[] {
  const debtors = new MaxHeap();
  const creditors = new MaxHeap();
  for (const b of balances) {
    if (b.amount < 0) {
      debtors.push({ person: b.person, amount: -b.amount });
    } else if (b.amount > 0) {
      creditors.push({ person: b.person, amount: b.amount });
    }
  }

  const settlements: Settlement[] = [];

  while (debtors.length > 0 && creditors.length > 0) {
    const d = debtors.pop();
    const c = creditors.pop();

    const amount = Math.min(d.amount, c.amount);
    settlements.push({ from: d.person, to: c.person, amount });

    d.amount -= amount;
    c.amount -= amount;

    if (d.amount > 0) {
      debtors.push(d);
    }
    if (c.amount > 0) {
      creditors.push(c);
    }
  }

  return settlements;
}
