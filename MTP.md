# Minimum Transaction Problem — Theory

## Problem definition

Given a directed graph `G = (V, E)` where each edge `u → v` has
weight `w(u,v) > 0` (u owes v an amount), find a directed graph
`G' = (V, E')` with the same vertex set such that:

1. **Balance preservation.** For every `v ∈ V`, the net balance
   `in(v) − out(v)` is the same in `G` and `G'`.
2. **Minimality.** `|E'|` is minimised.

Each edge in `G'` represents a transaction `from → to` with positive
amount. No fees, limits, or joint accounts — just direct transfers.
The net balance of a person is the difference between what they are
owed and what they owe.

## Netting theorem

The problem is always stated on **net balances**, not on the original
debts. This is justified by the netting theorem:

> Two sets of obligations that produce the same net balances for every
> person are **equivalent** for settlement purposes. Any sequence of
> settlements that zeroes the net balances works for both.

**Proof sketch.** Money is fungible: one euro is indistinguishable
from any other. If A→B→C is a chain of payments, the same net effect
is achieved by A→C directly (skipping B), because B's inflow from A
and outflow to C cancel. By repeatedly composing parallel and serial
transactions, any obligation graph reduces to a unique multiset of net
balances. The reduction is many-to-one: infinitely many obligation
graphs map to the same net balance vector.

**Practical consequence.** The original edges (who owed whom) carry no
information needed for minimisation. Only the net positions matter.

## Connection to subset sum

If you split the group into subgroups that each sum to zero, you can
settle each subgroup independently. A subgroup of size `k` needs at
most `k-1` internal transactions.

Minimising global transactions is equivalent to **maximising the
number of zero-sum subgroups** in a partition of the group. Deciding
whether a subset of balances sums to zero is the **subset sum problem**,
which is NP-complete. Every zero-sum subgroup found saves one
transaction compared to the naive `n-1` bound.

## NP-hardness

The Minimum Transaction Problem is NP-hard. Two independent reductions:

**1. From subset sum (Banerjee, Jayapaul, Satti, COCOON 2018).**
Given an instance `S = {s₁, ..., sₖ}` of subset sum, construct an MTP
instance with people `{p₁, ..., pₖ, pₖ₊₁, pₖ₊₂}` where:
- `p₁, ..., pₖ` have balances `+s₁, ..., +sₖ`
- `pₖ₊₁` has balance `T` (the target sum)
- `pₖ₊₂` has balance `-(T + Σsᵢ)`

A zero-sum subset of `{s₁,...,sₖ}` summing to `T` corresponds to a
solution with one fewer transaction. If MTP were solvable in
polynomial time, subset sum would be too.

**2. From minimum feedback arc set (MFAS).**
MTP on a directed graph `G = (V, E)` with edge weights `w(e)` is
equivalent to finding a minimum feedback arc set on the same graph.
The weight on each edge `u→v` represents a debt. Removing an edge
(settling the debt) must break all directed cycles. Finding the
minimum set of edges to remove to make the graph acyclic is exactly
the MFAS problem, which is NP-hard even for tournaments.

**Practical consequence.** No polynomial algorithm exists unless P = NP.
The optimal solution requires exponential time in the worst case —
feasible for 10–15 people, unworkable for 100+.

## Lower bounds

**Trivial lower bound.** With `|D|` debtors and `|C|` creditors, at
least `max(|D|, |C|)` transactions are needed: each transaction
involves exactly one debtor and one creditor, so no single transaction
can zero two debtors or two creditors.

**With zero-sum subgroups.** If the set of balances can be partitioned
into `z` disjoint zero-sum subsets, the minimum number of transactions
is at least `n - z` (each subgroup of size `k` needs at least `k-1`
transactions, and summing over subgroups gives `n - z`).

**Upper bound (spanning tree).** A single payer can settle everyone:
one person pays all creditors, and all debtors pay that person. This
requires `n-1` transactions and is always achievable, no matter the
amounts.

## Greedy heuristic (implemented)

The tool uses a greedy max-heap heuristic:

1. Split people into creditors (positive balance) and debtors (negative).
2. Build max-heaps for both groups.
3. Pop the largest creditor and the largest debtor.
4. Settle the minimum of the two amounts.
5. Push the remainder (if any) back into the appropriate heap.
6. Repeat until both heaps are empty.

Each iteration produces one transaction and removes at least one person
from consideration. This guarantees at most `n-1` transactions.

**Two-pointer variant.** An alternative implementation sorts once and
uses two moving pointers. It saves the heap overhead (`O(n log n)`
total vs `O(n log n)` per step) but is strictly dominated: it may pick
a partially-consumed person over a larger untouched one. The heap
variant always picks the global best at each step, producing solutions
that are never worse and sometimes better.

**Why the greedy is not optimal.** The greedy matches one debtor with
one creditor at a time. It cannot discover zero-sum subsets of
cardinality > 2 that require splitting amounts across multiple
counterparties. A concrete counterexample:

| Person | Balance |
|--------|---------|
| A      | -700    |
| B      | -600    |
| C      | -500    |
| D      | +100    |
| E      | +300    |
| F      | +400    |
| G      | +500    |
| H      | +500    |

The greedy (two-pointer) produces **7 transactions**:

| Step | Transaction |
|------|-------------|
| 1    | A → H 500   |
| 2    | A → G 200   |
| 3    | B → G 300   |
| 4    | B → F 300   |
| 5    | C → F 100   |
| 6    | C → E 300   |
| 7    | C → D 100   |

The optimal solution requires **5 transactions**:

| Transaction | Group |
|-------------|-------|
| A → E 300   | {-700, 300, 400} |
| A → F 400   | (same) |
| B → G 500   | {-600, 500, 100} |
| B → D 100   | (same) |
| C → H 500   | {-500, 500} |

The greedy wastes transactions because it matches A with G/H (500
each) instead of splitting A across E and F (300+400 = 700 exactly).
This forces B and C to settle the residuals of G and H in extra
transactions.

## Approximation guarantee

**No constant-factor approximation is known for the base variant.**
The greedy heuristic has no proven bound better than `n-1` (the
trivial upper bound).

**3/2 approximation for a restricted variant.** Banerjee, Jayapaul,
and Satti (COCOON 2018) show that if both edge deletions and edge
additions are allowed (vs. minimising the number of remaining edges),
a **3/2-approximation** exists. This is the tightest theoretical
guarantee in the literature. The algorithm uses a flow-based
construction to find a solution with at most `3/2 · OPT` edges.

**Practical performance.** For small groups (≤30 people) with typical
trip/dinner amounts, the greedy heuristic is indistinguishable from
optimal. The gap appears only with carefully constructed worst-case
inputs involving several competing large amounts.

## Variant with constraints (e.g. Splitwise)

Splitwise's "Simplify Debts" feature adds two constraints not present
in the unrestricted MTP:

1. No one shall owe a person they did not owe before.
2. No one shall owe more in total than before simplification.

These constraints reduce the problem to adjusting weights on existing
edges, without adding new edges or reversing directions. The solution
is a simple transitive reduction: for each triple `A→B→C`, replace with
`A→C` when amounts permit. This is solvable greedily in polynomial
time and does not require the full MTP formulation.

**The unrestricted problem** (our formulation) has no such constraints:
anyone can pay anyone, regardless of whether they had a prior
relationship. This is strictly harder but produces fewer transactions.

## Optimal solution (not implemented)

Finding the true minimum requires solving the partition problem on
every subset of the group. Approaches include:

- **Held-Karp style DP:** `O(2ⁿ · n)` — enumerate every subset, check
  if it sums to zero, find the optimal partition via DP. Feasible for
  `n ≤ 20`.
- **Integer linear programming:** formulate as an ILP and use a solver.
  Scales better but still NP-hard in general.

For this project the greedy heuristic is good enough. The target
audience (dinners, trips, gifts) never needs the true minimum, and
the exponential cost of the exact solution isn't worth the marginal
improvement.

## Further reading

- [Subset sum problem — Wikipedia](https://en.wikipedia.org/wiki/Subset_sum_problem)
- [Partition problem — Wikipedia](https://en.wikipedia.org/wiki/Partition_problem)
- [Feedback arc set — Wikipedia](https://en.wikipedia.org/wiki/Feedback_arc_set)
- Banerjee, Jayapaul, Satti: *Minimum Transactions Problem*,
  COCOON 2018, pp. 650–661.
  [DOI: 10.1007/978-3-319-94776-1_54](https://doi.org/10.1007/978-3-319-94776-1_54)
