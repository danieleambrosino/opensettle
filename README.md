# OpenSettle

Minimal group expense settlement. CLI + webapp.

```
cat expenses.json | opensettle
```

## Pipeline

```
                          ┌─► Obligation[] ──► Balance[] ──┐
Expense[] ──► split ──────┘                                ├──► Settlement[]
                          └─ (tweak here if needed) ───────┘
```

Four stages, each a transformation on JSON:

| Input | Command | Output |
|-------|---------|--------|
| `Expense[]` | `expense-splitter` | `Obligation[]` |
| `Obligation[]` | `debt-minimizer` | `Settlement[]` |
| `Expense[]` | `settle` (all-in-one) | `Settlement[]` |

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
Greedy algorithm using a max-heap. Pair the biggest debtor with the
biggest creditor, settle the minimum, repeat until everyone's at zero.
Produces at most n-1 transactions.

## CLI

### Build

```bash
cd cli
make
```

Binaries land in `cli/bin/`.

### Usage

**All-in-one (from expenses to settlements):**

```bash
cat expenses.json | go run ./cli/cmd/settle
```

**Step by step (inspect or edit intermediates):**

```bash
cat expenses.json | go run ./cli/cmd/expense-splitter > obligations.json
# optionally: vim obligations.json, fix a share
cat obligations.json | go run ./cli/cmd/debt-minimizer > settlements.json
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

```bash
cd webapp
npm install
npm run dev
```

### Feature: edit any stage

Each stage auto-syncs from the previous one. But you can turn off
auto-sync and edit the data by hand — useful when the equal split
doesn't fit reality and someone should pay a bit less.

## The story

I was organising a group gift. Multiple people bought different things,
and at the end we needed to split everything fairly. Some people wanted
to contribute less than others.

I could have used Tricount or Splitwise. But where's the fun in that?

I wanted to write the splitting algorithm myself. I wanted to learn Go.
And I wanted a tool that works the Unix way — small composable commands
that pipe JSON around, so I can inspect, edit, or rewire the intermediate
results if someone's share doesn't feel right.

So I built a CLI. Then I thought: why not a GUI too? I wanted to try
SvelteKit, and having a visual version of the same pipeline felt like
a good excuse. The algorithm ended up implemented twice — Go for the CLI,
TypeScript for the webapp. Who cares. It's a side project, and writing
the same thing in two languages was half the fun.

## Project structure

```
├── cli/
│   ├── cmd/
│   │   ├── settle/             # all-in-one command
│   │   ├── expense-splitter/   # Expense[] → Obligation[]
│   │   └── debt-minimizer/     # Obligation[] → Settlement[]
│   ├── internal/
│   │   ├── types/types.go      # PersonID, Expense, Obligation, etc.
│   │   ├── service/            # split, balance, settlement logic
│   │   └── cli/io.go           # JSON read/write helpers
│   ├── go.mod
│   └── Makefile
│
├── webapp/
│   └── src/
│       ├── lib/components/     # Svelte components
│       ├── lib/index.ts        # split, balance, settlement (TS)
│       ├── lib/storage.ts      # localStorage persistence
│       └── routes/             # SvelteKit pages
│
└── test.json                   # example input
```

## Q&A

**Why not Tricount / Splitwise?**  
I wanted to write the algorithm myself, control every detail, and learn
something in the process. Also, Tricount doesn't let me pipe stuff
through `jq`.

**Why Go?**  
I wanted to learn it. Zero dependencies felt like a nice constraint.
The result is a single static binary per command.

**Why two separate CLI commands (and one combined)?**  
Unix philosophy: do one thing and do it well. The separate commands let
you pipe, inspect, and edit the intermediate data. The combined `settle`
is just a convenience wrapper.

**Can I tweak the intermediate results?**  
Yes — that's the whole point. Run `expense-splitter`, edit the JSON,
run `debt-minimizer`. The webapp has a toggle to turn off auto-sync
at each stage for the same reason.

**Why is there both a CLI and a webapp?**  
Different tools for different moments. The CLI is great for batch,
automation, and terminal people. The webapp is for everyone else
who just wants to fill a form and see who owes what. And I wanted
to learn SvelteKit.

**Wait, the algorithm is implemented twice?**  
Yes, Go and TypeScript. Same logic, different syntax. It's a learning
project — rewriting the same thing in another language is a great way
to spot design flaws and appreciate language quirks. Plus the webapp
doesn't need a backend.

## License

Do whatever you want with this :)
