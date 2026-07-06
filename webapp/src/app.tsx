import { createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
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

  createEffect(() => {
    if (state.autoSyncObligations) {
      setState("obligations", computedObligations());
    }
    if (state.autoSyncBalances) {
      setState("balances", computedBalances());
    }
    if (state.autoSyncSettlements) {
      setState("settlements", computedSettlements());
    }
  });

  createEffect(() => {
    saveExpenses(state.expenses);
  });

  const steps = () =>
    createSteps(
      state.expenses,
      state.obligations,
      state.balances,
      state.settlements
    );

  function addExpense(e: Expense) {
    setState("expenses", (prev) => [...prev, e]);
  }

  function removeExpense(idx: number) {
    setState("expenses", (prev) => prev.filter((_, i) => i !== idx));
  }

  function handleImport(data: ImportData) {
    setState({
      autoSyncBalances: data.autoSyncBalances,
      autoSyncObligations: data.autoSyncObligations,
      autoSyncSettlements: data.autoSyncSettlements,
      balances: data.balances,
      expenses: data.expenses,
      obligations: data.obligations,
      settlements: data.settlements,
    });
  }

  return (
    <div class="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Hero steps={steps()} />

      <div class="mx-auto flex max-w-6xl justify-end px-4 pb-4">
        <DataActions
          autoSyncBalances={state.autoSyncBalances}
          autoSyncObligations={state.autoSyncObligations}
          autoSyncSettlements={state.autoSyncSettlements}
          balances={state.balances}
          expenses={state.expenses}
          obligations={state.obligations}
          onImport={handleImport}
          settlements={state.settlements}
        />
      </div>

      <div class="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <SectionCard accent="indigo" number={1} title="Expenses">
          <ExpenseForm onAddExpense={addExpense} />
          <ExpenseTable
            items={state.expenses}
            onItemsChange={(items: Expense[]) => setState("expenses", items)}
            onRemove={removeExpense}
          />
        </SectionCard>

        <SectionCard
          accent="violet"
          actions={
            <AutoSync
              accent="violet"
              autoSync={state.autoSyncObligations}
              onsync={() => setState("autoSyncObligations", true)}
            />
          }
          number={2}
          title="Obligations"
        >
          <FromToTable
            accent="violet"
            emptyMessage="Obligations appear automatically when expenses are added"
            items={state.obligations}
            onfocus={() => setState("autoSyncObligations", false)}
            onItemsChange={(items: Transaction[]) =>
              setState("obligations", items)
            }
            onRemove={(i) => {
              setState("obligations", (prev) => prev.filter((_, j) => j !== i));
              setState("autoSyncObligations", false);
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
              onsync={() => setState("autoSyncBalances", true)}
            />
          }
          number={3}
          title="Balances"
        >
          <BalanceTable
            emptyMessage="Balances appear automatically when obligations are available"
            items={state.balances}
            onfocus={() => setState("autoSyncBalances", false)}
            onItemsChange={(items: Balance[]) => setState("balances", items)}
            onRemove={(i) => {
              setState("balances", (prev) => prev.filter((_, j) => j !== i));
              setState("autoSyncBalances", false);
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
              onsync={() => setState("autoSyncSettlements", true)}
            />
          }
          number={4}
          title="Settlements"
        >
          <FromToTable
            accent="emerald"
            emptyMessage="Settlements appear automatically when balances are available"
            items={state.settlements}
            onfocus={() => setState("autoSyncSettlements", false)}
            onItemsChange={(items: Transaction[]) =>
              setState("settlements", items)
            }
            onRemove={(i) => {
              setState("settlements", (prev) => prev.filter((_, j) => j !== i));
              setState("autoSyncSettlements", false);
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
  expenseList: Expense[],
  obligationList: Transaction[],
  balanceList: Balance[],
  settlementList: Settlement[]
) {
  return [
    {
      active: true,
      done: expenseList.length > 0,
      id: "expenses" as const,
      label: "Expenses",
    },
    {
      active: expenseList.length > 0,
      done: obligationList.length > 0,
      id: "obligations" as const,
      label: "Obligations",
    },
    {
      active: obligationList.length > 0,
      done: balanceList.length > 0,
      id: "balances" as const,
      label: "Balances",
    },
    {
      active: balanceList.length > 0,
      done: settlementList.length > 0,
      id: "settlements" as const,
      label: "Settlements",
    },
  ];
}
