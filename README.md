# OpenSettle

Splits expenses and minimises the transfers needed to settle the group.
Unlike Splitwise or Tricount, this is free and open source — the code,
the algorithms, and the theory are all visible in this repo.

Try it in the browser: [danieleambrosino.github.io/opensettle](https://danieleambrosino.github.io/opensettle)

## Quick start

Four friends go out. Alice pays for dinner (€240), Bob for drinks (€180),
Charlie for snacks (€120). Diana pays nothing.

Create `expenses.json` (all amounts are in **cents**: €1.00 = 100):

```json
[
  {"payer": "Alice", "amount": 24000, "participants": [
    {"person": "Alice"}, {"person": "Bob"}, {"person": "Charlie"}, {"person": "Diana"}
  ]},
  {"payer": "Bob", "amount": 18000, "participants": [
    {"person": "Bob"}, {"person": "Charlie"}, {"person": "Diana"}
  ]},
  {"payer": "Charlie", "amount": 12000, "participants": [
    {"person": "Charlie"}, {"person": "Diana"}
  ]}
]
```

Then run:

```bash
opensettle < expenses.json
```

The tool figures out who owes whom and minimises transfers — only 2
transactions needed instead of the naive 3-or-more.

Output:

```json
[
  {"from": "Diana", "to": "Alice", "amount": 18000},
  {"from": "Charlie", "to": "Bob", "amount": 6000}
]
```

## Backstory

I was organising a group gift. Multiple people bought different things,
and at the end we needed to split everything fairly. Some people wanted
to contribute a different amount.

I could have used Tricount or Splitwise. But where's the fun in that?

The problem is deceptively simple: split some expenses, then figure out who pays whom to settle everyone with as few transactions as possible. That second part — the **Minimum Transaction Problem** — is what hooked me. The theory (subset sum, NP-hardness, why greedy works) is documented in [MTP.md](MTP.md). Easy on the surface, but finding the truly minimal set of transactions is NP-hard. The tension between a simple question and a hard problem fascinated me.

I wanted to write the splitting algorithm myself, improve my Go and write a tool that works the Unix way — small composable commands that pipe JSON around, so I can inspect, edit, or rewire the intermediate
results if someone's share doesn't feel right.

So I built a CLI. Then I thought: why not a GUI too? Having a visual
version of the same pipeline felt like a good excuse to build something
with Solid. The algorithm ended up implemented twice — Go for the CLI,
TypeScript for the webapp. Who cares. It's a side project, and writing
the same thing in two languages was half the fun 🙂

All algorithms are hand-written. The webapp UI — the Solid components,
layout, and styling — was built with some help from DeepSeek V4 Flash.
Consider it my pair programmer for the frontend bits 🙂

## CLI

### Build

Requires Go 1.26+.

```bash
cd cli && make
```

Binaries land in `cli/bin/`.

### Usage

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
distributed one by one. The payer is skipped.

## Web app

A self-contained Solid frontend. Same pipeline, but visual and
interactive. Runs entirely in the browser.

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

## Q&A

**Why not Tricount / Splitwise?**  
I wanted to write the algorithm myself, control every detail, and learn
something in the process. Also, Tricount doesn't let me pipe stuff
through `jq` 🙂

**Why Go?**  
I wanted to have fun with a language I use less frequently than others
and have always admired. Zero dependencies felt like a nice constraint.
The result is a single static binary.

**Why subcommands instead of separate binaries?**  
Separate binaries would be more Unix-pure, but one binary is easier
to install and keep on the PATH. The subcommands still enforce the
pipeline: `split` and `minimize` are independent stages you can pipe
through. The default mode is just sugar for the common case.

**Can I tweak the intermediate results?**  
Yes. Run `opensettle split`, edit the JSON, run `opensettle minimize`.
The webapp has a toggle to turn off auto-sync at each stage for the
same reason.

**Why is there both a CLI and a webapp?**  
Different tools for different moments. The CLI is great for batch,
automation, and terminal people. The webapp is for everyone else
who just wants to fill a form and see who owes what.

**Wait, the algorithm is implemented twice?**  
Yes, Go and TypeScript. Same logic, different syntax. Writing the same
thing in two languages was half the fun, and it runs the same pipeline
entirely in the browser.

**Why not compile Go to WASM for the webapp?**  
I didn't like the idea of shipping several MB of WebAssembly over HTTP
for something I could implement in a handful of lines of TypeScript.
I might do it for fun and profit to observe the WASM world more closely
🙂

## License

MIT
