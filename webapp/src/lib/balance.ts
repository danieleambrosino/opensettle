import type { Balance, Cents, Obligation, PersonID } from "./types";

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
