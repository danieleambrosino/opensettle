import { createEffect, createMemo, createSignal } from "solid-js";
import { computeBalances } from "@/lib/balance";
import AutoSync from "@/lib/components/auto-sync";
import BalanceTable from "@/lib/components/balance-table";
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
import type { Balance, Expense, Obligation, Settlement } from "@/lib/types";

type StepId = "expenses" | "obligations" | "balances" | "settlements";

export default function App() {
  const [expenses, setExpenses] = createSignal<Expense[]>(loadExpenses() ?? []);
  const [obligations, setObligations] = createSignal<Obligation[]>([]);
  const [balances, setBalances] = createSignal<Balance[]>([]);
  const [settlements, setSettlements] = createSignal<Settlement[]>([]);

  const [autoSyncObligations, setAutoSyncObligations] = createSignal(true);
  const [autoSyncBalances, setAutoSyncBalances] = createSignal(true);
  const [autoSyncSettlements, setAutoSyncSettlements] = createSignal(true);

  const computedObligations = createMemo(() =>
    expenses().length > 0 ? splitExpenses(expenses()) : []
  );
  const computedBalances = createMemo(() =>
    obligations().length > 0 ? computeBalances(obligations()) : []
  );
  const computedSettlements = createMemo(() =>
    balances().length > 0 ? computeMinimalSettlementSet(balances()) : []
  );

  createEffect(() => {
    if (autoSyncObligations()) {
      setObligations(computedObligations());
    }
  });
  createEffect(() => {
    if (autoSyncBalances()) {
      setBalances(computedBalances());
    }
  });
  createEffect(() => {
    if (autoSyncSettlements()) {
      setSettlements(computedSettlements());
    }
  });

  function manualEditObligations() {
    setAutoSyncObligations(false);
  }
  function manualEditBalances() {
    setAutoSyncBalances(false);
  }
  function manualEditSettlements() {
    setAutoSyncSettlements(false);
  }

  createEffect(() => {
    saveExpenses(expenses());
  });

  const steps = createMemo(() => [
    {
      id: "expenses" satisfies StepId,
      label: "Expenses",
      done: expenses().length > 0,
      active: true,
    },
    {
      id: "obligations" satisfies StepId,
      label: "Obligations",
      done: obligations().length > 0,
      active: expenses().length > 0,
    },
    {
      id: "balances" satisfies StepId,
      label: "Balances",
      done: balances().length > 0,
      active: obligations().length > 0,
    },
    {
      id: "settlements" satisfies StepId,
      label: "Settlements",
      done: settlements().length > 0,
      active: balances().length > 0,
    },
  ]);

  function addExpense(e: {
    payer: string;
    amount: number;
    participants: Participant[];
  }) {
    setExpenses([
      ...expenses(),
      {
        payer: e.payer,
        amount: e.amount,
        participants: e.participants,
      },
    ]);
  }

  function removeExpense(idx: number) {
    setExpenses(expenses().filter((_, i) => i !== idx));
  }

  function handleImport(data: {
    expenses: Expense[];
    obligations: Obligation[];
    balances: Balance[];
    settlements: Settlement[];
    autoSyncObligations: boolean;
    autoSyncBalances: boolean;
    autoSyncSettlements: boolean;
  }) {
    setExpenses(data.expenses);
    setObligations(data.obligations);
    setBalances(data.balances);
    setSettlements(data.settlements);
    setAutoSyncObligations(data.autoSyncObligations);
    setAutoSyncBalances(data.autoSyncBalances);
    setAutoSyncSettlements(data.autoSyncSettlements);
  }

  return (
    <div class="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Hero steps={steps()} />

      <div class="mx-auto flex max-w-6xl justify-end px-4 pb-4">
        <DataActions
          autoSyncBalances={autoSyncBalances()}
          autoSyncObligations={autoSyncObligations()}
          autoSyncSettlements={autoSyncSettlements()}
          balances={balances()}
          expenses={expenses()}
          obligations={obligations()}
          onImport={handleImport}
          settlements={settlements()}
        />
      </div>

      <div class="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <SectionCard accent="indigo" number={1} title="Expenses">
          <ExpenseForm onAddExpense={addExpense} />
          <ExpenseTable
            items={expenses()}
            onItemsChange={setExpenses}
            onRemove={removeExpense}
          />
        </SectionCard>

        <SectionCard
          accent="violet"
          actions={
            <AutoSync
              accent="violet"
              autoSync={autoSyncObligations()}
              onsync={() => setAutoSyncObligations(true)}
            />
          }
          number={2}
          title="Obligations"
        >
          <FromToTable
            accent="violet"
            emptyMessage="Obligations appear automatically when expenses are added"
            items={obligations()}
            onfocus={manualEditObligations}
            onItemsChange={setObligations}
            onRemove={(i) => {
              setObligations(obligations().filter((_, j) => j !== i));
              manualEditObligations();
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
              autoSync={autoSyncBalances()}
              onsync={() => setAutoSyncBalances(true)}
            />
          }
          number={3}
          title="Balances"
        >
          <BalanceTable
            emptyMessage="Balances appear automatically when obligations are available"
            items={balances()}
            onfocus={manualEditBalances}
            onItemsChange={setBalances}
            onRemove={(i) => {
              setBalances(balances().filter((_, j) => j !== i));
              manualEditBalances();
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
              autoSync={autoSyncSettlements()}
              onsync={() => setAutoSyncSettlements(true)}
            />
          }
          number={4}
          title="Settlements"
        >
          <FromToTable
            accent="emerald"
            emptyMessage="Settlements appear automatically when balances are available"
            items={settlements()}
            onfocus={manualEditSettlements}
            onItemsChange={setSettlements}
            onRemove={(i) => {
              setSettlements(settlements().filter((_, j) => j !== i));
              manualEditSettlements();
            }}
          >
            <CheckCircle class="size-7 text-slate-600" />
          </FromToTable>
        </SectionCard>
      </div>
    </div>
  );
}
