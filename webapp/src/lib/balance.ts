import type { Balance, Cents, Obligation, PersonID } from "./types";

export function computeBalances(obligations: Obligation[]): Balance[] {
  const balancesMap = new Map<PersonID, Cents>();
  for (const o of obligations) {
    balancesMap.set(o.to, (balancesMap.get(o.to) || 0) + o.amount);
    balancesMap.set(o.from, (balancesMap.get(o.from) || 0) - o.amount);
  }
  return balancesMap
    .entries()
    .map(([id, amt]) => ({ amount: amt, person: id }))
    .toArray()
    .toSorted(
      (a, b) => a.amount - b.amount || a.person.localeCompare(b.person)
    );
}
