import { createEffect, createMemo, createStore } from "solid-js";
import { computeBalances } from "@/lib/balance";
import AutoSync from "@/lib/components/auto-sync";
import BalanceTable from "@/lib/components/balance-table";
import type { ImportData } from "@/lib/components/data-actions";
import DataActions from "@/lib/components/data-actions";
import ExpenseForm from "@/lib/components/expense-form";
import ExpenseTable from "@/lib/components/expense-table";
import FromToTable from "@/lib/components/from-to-table";
import Hero from "@/lib/components/hero";
import CheckCircle from "@/lib/components/icons/check-circle";
import CurrencyEuro from "@/lib/components/icons/currency-euro";
import Document from "@/lib/components/icons/document";
import SectionCard from "@/lib/components/section-card";
import { computeMinimalSettlementSet } from "@/lib/settlement";
import { splitExpenses } from "@/lib/split";
import { loadExpenses, saveExpenses } from "@/lib/storage";
import type { Balance, Expense, Settlement, Transaction } from "@/lib/types";

interface AppState {
  autoSyncBalances: boolean;
  autoSyncObligations: boolean;
  autoSyncSettlements: boolean;
  balances: Balance[];
  expenses: Expense[];
  obligations: Transaction[];
  settlements: Settlement[];
}

export default function App() {
  const [state, setState] = createStore<AppState>({
    autoSyncBalances: true,
    autoSyncObligations: true,
    autoSyncSettlements: true,
    balances: [],
    expenses: loadExpenses() ?? [],
    obligations: [],
    settlements: [],
  });

  const computedObligations = createMemo(() =>
    state.expenses.length > 0 ? splitExpenses(state.expenses) : []
  );
  const computedBalances = createMemo(() =>
    state.obligations.length > 0 ? computeBalances(state.obligations) : []
  );
  const computedSettlements = createMemo(() =>
    state.balances.length > 0 ? computeMinimalSettlementSet(state.balances) : []
  );

  createEffect(
    () => ({
      balances: state.autoSyncBalances ? computedBalances() : undefined,
      obligations: state.autoSyncObligations
        ? computedObligations()
        : undefined,
      settlements: state.autoSyncSettlements
        ? computedSettlements()
        : undefined,
    }),
    ({ obligations, balances, settlements }) => {
      if (obligations) {
        setState((s) => {
          s.obligations = obligations;
        });
      }
      if (balances) {
        setState((s) => {
          s.balances = balances;
        });
      }
      if (settlements) {
        setState((s) => {
          s.settlements = settlements;
        });
      }
    }
  );

  createEffect(
    () => state.expenses,
    (expenses) => {
      saveExpenses(expenses);
    }
  );

  const steps = () =>
    createSteps(
      state.expenses,
      state.obligations,
      state.balances,
      state.settlements
    );

  function addExpense(e: Expense) {
    setState((s) => {
      s.expenses = [...s.expenses, e];
    });
  }

  function removeExpense(idx: number) {
    setState((s) => {
      s.expenses = s.expenses.filter((_, i) => i !== idx);
    });
  }

  function handleImport(data: ImportData) {
    setState((s) => {
      s.autoSyncBalances = data.autoSyncBalances;
      s.autoSyncObligations = data.autoSyncObligations;
      s.autoSyncSettlements = data.autoSyncSettlements;
      s.balances = data.balances;
      s.expenses = data.expenses;
      s.obligations = data.obligations;
      s.settlements = data.settlements;
    });
  }

  return (
    <div class="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Hero steps={steps()} />

      <div class="mx-auto flex max-w-6xl justify-end px-4 pb-4">
        <DataActions {...state} onImport={handleImport} />
      </div>

      <div class="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <SectionCard accent="indigo" number={1} title="Expenses">
          <ExpenseForm onAddExpense={addExpense} />
          <ExpenseTable
            items={state.expenses}
            onItemsChange={(items: Expense[]) =>
              setState((s) => {
                s.expenses = items;
              })
            }
            onRemove={removeExpense}
          />
        </SectionCard>

        <SectionCard
          accent="violet"
          actions={
            <AutoSync
              accent="violet"
              autoSync={state.autoSyncObligations}
              onsync={() =>
                setState((s) => {
                  s.autoSyncObligations = true;
                })
              }
            />
          }
          number={2}
          title="Obligations"
        >
          <FromToTable
            accent="violet"
            emptyMessage="Obligations appear automatically when expenses are added"
            items={state.obligations}
            onfocus={() =>
              setState((s) => {
                s.autoSyncObligations = false;
              })
            }
            onItemsChange={(items: Transaction[]) =>
              setState((s) => {
                s.obligations = items;
              })
            }
            onRemove={(i) => {
              setState((s) => {
                s.obligations = s.obligations.filter((_, j) => j !== i);
              });
              setState((s) => {
                s.autoSyncObligations = false;
              });
            }}
          >
            <Document class="size-7 text-slate-600" />
          </FromToTable>
        </SectionCard>

        <SectionCard
          accent="amber"
          actions={
            <AutoSync
              accent="amber"
              autoSync={state.autoSyncBalances}
              onsync={() =>
                setState((s) => {
                  s.autoSyncBalances = true;
                })
              }
            />
          }
          number={3}
          title="Balances"
        >
          <BalanceTable
            emptyMessage="Balances appear automatically when obligations are available"
            items={state.balances}
            onfocus={() =>
              setState((s) => {
                s.autoSyncBalances = false;
              })
            }
            onItemsChange={(items: Balance[]) =>
              setState((s) => {
                s.balances = items;
              })
            }
            onRemove={(i) => {
              setState((s) => {
                s.balances = s.balances.filter((_, j) => j !== i);
              });
              setState((s) => {
                s.autoSyncBalances = false;
              });
            }}
          >
            <CurrencyEuro class="size-7 text-slate-600" />
          </BalanceTable>
        </SectionCard>

        <SectionCard
          accent="emerald"
          actions={
            <AutoSync
              accent="emerald"
              autoSync={state.autoSyncSettlements}
              onsync={() =>
                setState((s) => {
                  s.autoSyncSettlements = true;
                })
              }
            />
          }
          number={4}
          title="Settlements"
        >
          <FromToTable
            accent="emerald"
            emptyMessage="Settlements appear automatically when balances are available"
            items={state.settlements}
            onfocus={() =>
              setState((s) => {
                s.autoSyncSettlements = false;
              })
            }
            onItemsChange={(items: Transaction[]) =>
              setState((s) => {
                s.settlements = items;
              })
            }
            onRemove={(i) => {
              setState((s) => {
                s.settlements = s.settlements.filter((_, j) => j !== i);
              });
              setState((s) => {
                s.autoSyncSettlements = false;
              });
            }}
          >
            <CheckCircle class="size-7 text-slate-600" />
          </FromToTable>
        </SectionCard>
      </div>
    </div>
  );
}

function createSteps(
  expenses: Expense[],
  obligations: Transaction[],
  balances: Balance[],
  settlements: Settlement[]
) {
  return [
    {
      active: true,
      done: expenses.length > 0,
      id: "expenses" as const,
      label: "Expenses",
    },
    {
      active: expenses.length > 0,
      done: obligations.length > 0,
      id: "obligations" as const,
      label: "Obligations",
    },
    {
      active: obligations.length > 0,
      done: balances.length > 0,
      id: "balances" as const,
      label: "Balances",
    },
    {
      active: balances.length > 0,
      done: settlements.length > 0,
      id: "settlements" as const,
      label: "Settlements",
    },
  ];
}
