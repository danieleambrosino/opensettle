# OpenSettle

Minimal group expense settlement. CLI + webapp.

```
opensettle < expenses.json
```

## Backstory

I was organising a group gift. Multiple people bought different things,
and at the end we needed to split everything fairly. Some people wanted
to contribute less than others.

I could have used Tricount or Splitwise. But where's the fun in that?

The problem is deceptively simple: split some expenses, then figure out who pays whom to settle everyone with as few transactions as possible. That second part — the Minimum Transaction Problem — is what hooked me. Easy on the surface, but finding the truly minimal set of transactions is NP-hard. The tension between a simple question and a hard problem fascinated me.

I wanted to write the splitting algorithm myself. I wanted to improve my Go.
And I wanted a tool that works the Unix way — small composable commands
that pipe JSON around, so I can inspect, edit, or rewire the intermediate
results if someone's share doesn't feel right.

So I built a CLI. Then I thought: why not a GUI too? Having a visual
version of the same pipeline felt like a good excuse to build something
with SvelteKit. The algorithm ended up implemented twice — Go for the CLI,
TypeScript for the webapp. Who cares. It's a side project, and writing
the same thing in two languages was half the fun 🙂

All algorithms are hand-written. The webapp UI — the Svelte components,
layout, and styling — was built with some help from DeepSeek V4 Flash.
Consider it my pair programmer for the frontend bits 🙂

## Quick start

```bash
# Three friends, one dinner
echo '[{"payer":"Alice","amount":3000,"participants":[
  {"person":"Alice"},{"person":"Bob"},{"person":"Charlie"}
]}]' | opensettle
```

Output:
```json
[{"from":"Bob","to":"Alice","amount":1000},
 {"from":"Charlie","to":"Alice","amount":1000}]
```

Alice paid €30 for the dinner. Bob and Charlie each owe Alice €10.

Same thing in the browser: [danieleambrosino.github.io/opensettle](https://danieleambrosino.github.io/opensettle)

## CLI

### Build

```bash
cd cli
make
# then: export PATH=$PATH:cli/bin
# or:  cp cli/bin/opensettle ~/.local/bin/
```

Binaries land in `cli/bin/`.

### Commands

| Input | Subcommand | Output |
|-------|------------|--------|
| `Expense[]` | `opensettle split` | `Obligation[]` |
| `Obligation[]` | `opensettle minimize` | `Settlement[]` |
| `Expense[]` | `opensettle` (default) | `Settlement[]` |

### Usage

**All-in-one (from expenses to settlements):**

```bash
opensettle < expenses.json
```

**Step by step (inspect or edit intermediates):**

```bash
opensettle split < expenses.json > obligations.json
# optionally: vim obligations.json, fix a share
opensettle minimize < obligations.json > settlements.json
```

### Input format

```json
[
  {
    "payer": "Alice",
    "amount": 32000,
    "participants": [
      { "person": "Alice" },
      { "person": "Bob" },
      { "person": "Charlie", "amount": 5000 }
    ]
  }
]
```

A participant with an explicit `amount` pays that much (capped at the
remaining). Everyone else splits the rest equally, with leftover cents
distributed one by one. The payer is skipped (they already paid).

## Web app

A self-contained SvelteKit frontend. Same pipeline, but visual and
interactive. Runs entirely in the browser — no backend needed.

**Live demo:** [danieleambrosino.github.io/opensettle](https://danieleambrosino.github.io/opensettle)

```bash
cd webapp
npm install
npm run dev
```

### Feature: edit any stage

Each stage auto-syncs from the previous one. But you can turn off
auto-sync and edit the data by hand — useful when the equal split
doesn't fit reality and someone should pay a bit less.

## How it works

Three functions, ~100 lines each.

**SplitExpenses**  
For each expense: participants with a fixed amount pay that (capped).
The rest is divided equally, with leftover cents distributed one at a
time. Skip the payer.

**ComputeBalances**  
Algebraic sum of obligations. Every `to` adds, every `from` subtracts.
Result is sorted by amount (asc), then by person.

**ComputeMinimalSettlementSet**  
This is the **Minimum Transaction Problem**. Finding the optimal
solution is NP-hard (subset sum), so the tool uses a greedy max-heap
heuristic. Pair the biggest debtor with the biggest creditor, settle
the minimum, repeat. Produces at most n-1 transactions.

## Q&A

**Why not Tricount / Splitwise?**  
I wanted to write the algorithm myself, control every detail, and learn
something in the process. Also, Tricount doesn't let me pipe stuff
through `jq` 🙂

**Why Go?**  
I knew it already, but I wanted to get better. Zero dependencies felt
like a nice constraint. The result is a single static binary per
command.

**What's the Minimum Transaction Problem?**  
Given a set of debts between a group, find the smallest set of
transactions that settles everyone. It's related to subset sum and is
NP-hard — the optimal solution requires exponential time in the worst
case.

**Why a greedy algorithm instead of the optimal one?**  
Because the optimal solution is NP-hard, and for a side project it
wasn't worth implementing. The greedy max-heap heuristic is dead
simple, runs in O(n log n), and produces at most n-1 transactions.
For the kind of groups that use this tool (dinners, trips, gifts) the
result is indistinguishable from optimal. If you're settling millions
of transactions, call me 🙂

**Why subcommands instead of separate binaries?**  
Unix philosophy: do one thing and do it well. The subcommands `split` and
`minimize` let you pipe, inspect, and edit the intermediate data. The
default mode (no subcommand) is just a convenience wrapper.

**Can I tweak the intermediate results?**  
Yes — that's the whole point. Run `opensettle split`, edit the JSON,
run `opensettle minimize`. The webapp has a toggle to turn off auto-sync
at each stage for the same reason.

**Why is there both a CLI and a webapp?**  
Different tools for different moments. The CLI is great for batch,
automation, and terminal people. The webapp is for everyone else
who just wants to fill a form and see who owes what.

**Wait, the algorithm is implemented twice?**  
Yes, Go and TypeScript. Same logic, different syntax. It's a learning
project — rewriting the same thing in another language is a great way
to spot design flaws and appreciate language quirks. Plus the webapp
doesn't need a backend.

## License

MIT
