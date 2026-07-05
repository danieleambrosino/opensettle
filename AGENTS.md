# OpenSettle — AI agent context

See `README.md` for overview, pipeline, types, and algorithms.
Here only what an AI agent needs to write code.

## Code conventions

- No comments (unless explicitly asked for)
- Package `internal/service` uses in-package tests (`package service`)
- JSON tags use `snake_case` on types
- Zero external dependencies

## Key file paths (CLI)

| Path | Content |
|------|---------|
| `cli/internal/types/types.go` | Shared types (PersonID, Expense, etc.) |
| `cli/internal/service/split.go` | SplitExpenses() |
| `cli/internal/service/balance.go` | ComputeBalances() |
| `cli/internal/service/settlement.go` | ComputeMinimalSettlementSet() |
| `cli/internal/service/balance_test.go` | Test ComputeBalances |
| `cli/internal/service/settlement_test.go` | Test settlement |
| `cli/internal/cli/io.go` | JSON read/write helpers |
| `cli/cmd/opensettle/main.go` | Single binary (subcommands: split, minimize) |
| `cli/Makefile` | Build target |

## Webapp (SvelteKit)

| Path | Content |
|------|---------|
| `webapp/src/lib/index.ts` | Algorithm (split, balance, settlement) in TS |
| `webapp/src/lib/types.d.ts` | TypeScript type definitions |
| `webapp/src/lib/storage.ts` | localStorage persistence |
| `webapp/src/lib/components/` | Svelte components |
| `webapp/src/routes/+page.svelte` | Main page |
