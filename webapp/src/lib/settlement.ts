import type { Balance, Settlement } from "./types";

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
    const last = this.data.pop() as Balance;
    if (this.data.length > 0) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  private _siftUp(idx: number): void {
    let i = idx;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[parent].amount >= this.data[i].amount) {
        break;
      }
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private _siftDown(idx: number): void {
    const n = this.data.length;
    let i = idx;
    while (true) {
      let largest = i;
      const left = i * 2 + 1;
      const right = left + 1;
      if (left < n && this.data[left].amount > this.data[largest].amount) {
        largest = left;
      }
      if (right < n && this.data[right].amount > this.data[largest].amount) {
        largest = right;
      }
      if (largest === i) {
        break;
      }
      [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
      i = largest;
    }
  }
}

export function computeMinimalSettlementSet(balances: Balance[]): Settlement[] {
  const debtors = new MaxHeap();
  const creditors = new MaxHeap();
  for (const b of balances) {
    if (b.amount < 0) {
      debtors.push({ amount: -b.amount, person: b.person });
    } else if (b.amount > 0) {
      creditors.push({ amount: b.amount, person: b.person });
    }
  }

  const settlements: Settlement[] = [];

  while (debtors.length > 0 && creditors.length > 0) {
    const d = debtors.pop();
    const c = creditors.pop();

    const amount = Math.min(d.amount, c.amount);
    settlements.push({ amount, from: d.person, to: c.person });

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
