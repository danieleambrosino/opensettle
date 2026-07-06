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
| `cli/internal/service/split_test.go` | Test SplitExpenses |
| `cli/internal/service/balance_test.go` | Test ComputeBalances |
| `cli/internal/service/settlement_test.go` | Test settlement |
| `cli/internal/cli/io.go` | JSON read/write helpers |
| `cli/cmd/opensettle/main.go` | Single binary (subcommands: split, minimize) |
| `cli/Makefile` | Build target |

## Webapp (Solid)

| Path | Content |
|------|---------|
| `webapp/src/lib/types.ts` | TypeScript type definitions |
| `webapp/src/lib/split.ts` | SplitExpenses algorithm |
| `webapp/src/lib/balance.ts` | ComputeBalances algorithm |
| `webapp/src/lib/settlement.ts` | ComputeMinimalSettlementSet algorithm |
| `webapp/src/lib/storage.ts` | localStorage persistence |
| `webapp/src/lib/utils.ts` | Utility helpers |
| `webapp/src/lib/components/` | Solid components |
| `webapp/src/app.tsx` | Main page (orchestrator + UI) |
| `webapp/src/index.tsx` | Entry point |
| `webapp/src/index.css` | Global styles |
