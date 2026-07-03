# OpenSettle / Cash Flow Minimizer

## Cosa fa

Pipeline a 2 stadi per dividere spese di gruppo e minimizzare i bonifici di rimborso.

```
Expense[] (JSON stdin)
  → [expense-splitter] → SplitExpenses()
  → Obligation[] (JSON stdout)
  → [debt-minimizer] → ComputeBalances() + ComputeMinimalSettlementSet()
  → Settlement[] (JSON stdout)
```

Esempio:
```bash
cat test.json | go run ./cmd/expense-splitter | go run ./cmd/debt-minimizer
```

## Tech stack

- **Go 1.26.4**, modulo `danieleambrosino.it/opensettle`
- Zero dipendenze esterne
- CLI Unix-pipe: JSON su stdin/stdout
- Build con `make` (target: `build`, `clean`)
- Binary statici in `bin/` (gitignorati)

## Struttura

```
├── cmd/
│   ├── expense-splitter/main.go    # CLI: Expense[] → Obligation[]
│   └── debt-minimizer/main.go      # CLI: Obligation[] → Settlement[]
├── internal/
│   ├── types/types.go              # Definizioni tipi (PersonID, Expense, Obligation, ecc.)
│   └── service/
│       ├── split.go                # SplitExpenses(): divide spese in obblighi
│       ├── balance.go              # ComputeBalances(): obblighi → saldi netti
│       ├── settlement.go           # ComputeMinimalSettlementSet(): greedy max-heap
│       ├── balance_test.go         # Test ComputeBalances
│       └── settlement_test.go      # Test ComputeMinimalSettlementSet
└── Makefile
```

## Tipi chiave (`types.go`)

| Tipo | Descrizione |
|------|-------------|
| `PersonID` | `string` |
| `UnsignedCents` | `uint` |
| `Cents` | `int` (saldi, può essere negativo) |
| `Transaction{From, To, Amount}` | Struttura base (da, a, importo) |
| `Obligation` | alias di `Transaction` (debito) |
| `Settlement` | alias di `Transaction` (bonifico consigliato) |
| `Balance{Person, Amount}` | Saldo netto: negativo = debitore, positivo = creditore |
| `Participant{Person, Amount?}` | Partecipante con quota opzionale |
| `Expense{Payer, Amount, Participants}` | Spesa di gruppo |

## Logica

### `SplitExpenses(expenses)`
Per ogni spesa: chi ha `Amount` specificato paga quello (capped al rimanente); il resto è diviso equamente tra gli altri, con cents distribuiti uno a testa. Skip del pagatore stesso.

### `ComputeBalances(obligations)`
Somma algebrica: `To` += amount, `From` -= amount. Risultato ordinato per amount (asc) poi per person.

### `ComputeMinimalSettlementSet(balances)`
Algoritmo greedy con max-heap (`container/heap`): accoppia il debitore più grande col creditore più grande finché tutti a zero. Produce al massimo `n-1` transazioni.

## Test

Framework standard Go `testing`. Esegui con:
```bash
go test ./internal/service/...
```

**Copertura attuale:**
- `TestComputeBalances` (balance_test.go)
- `TestComputeMinimalSettlementSet` (settlement_test.go)
- **Mancante**: test per `split.go`

## Convenzioni codice

- Nessun commento (se non richiesti esplicitamente)
- Package `internal/service` usa test in-package (`package service`)
- JSON tag `snake_case` sui tipi
- Zero dipendenze esterne
