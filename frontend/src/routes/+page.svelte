<script lang="ts">
  import AutoSync from "$lib/components/AutoSync.svelte";
  import BalanceTable from "$lib/components/BalanceTable.svelte";
  import DataActions from "$lib/components/DataActions.svelte";
  import ExpenseForm from "$lib/components/ExpenseForm.svelte";
  import ExpenseTable from "$lib/components/ExpenseTable.svelte";
  import FromToTable from "$lib/components/FromToTable.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import CheckCircle from "$lib/components/icons/CheckCircle.svelte";
  import CurrencyEuro from "$lib/components/icons/CurrencyEuro.svelte";
  import DocumentIcon from "$lib/components/icons/Document.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import {
    computeBalances,
    computeMinimalSettlementSet,
    splitExpenses,
  } from "$lib/index";
  import { loadExpenses, saveExpenses } from "$lib/storage";
  import type { Balance, Expense, Obligation, Settlement } from "$lib/types";

  let expenses = $state<Expense[]>(loadExpenses() ?? []);
  let obligations = $state<Obligation[]>([]);
  let balances = $state<Balance[]>([]);
  let settlements = $state<Settlement[]>([]);

  // ── Pure computations (derived) ──
  let computedObligations = $derived(
    expenses.length > 0 ? splitExpenses(expenses) : []
  );
  let computedBalances = $derived(
    obligations.length > 0 ? computeBalances(obligations) : []
  );
  let computedSettlements = $derived(
    balances.length > 0 ? computeMinimalSettlementSet(balances) : []
  );

  // ── Sync derived → editable state ──
  let autoSyncObligations = $state(true);
  let autoSyncBalances = $state(true);
  let autoSyncSettlements = $state(true);

  $effect(() => {
    if (autoSyncObligations) {
      obligations = computedObligations;
    }
  });
  $effect(() => {
    if (autoSyncBalances) {
      balances = computedBalances;
    }
  });
  $effect(() => {
    if (autoSyncSettlements) {
      settlements = computedSettlements;
    }
  });

  $effect(() => {
    saveExpenses(expenses);
  });

  function syncObligations() {
    autoSyncObligations = true;
  }
  function manualEditObligations() {
    autoSyncObligations = false;
  }
  function syncBalances() {
    autoSyncBalances = true;
  }
  function manualEditBalances() {
    autoSyncBalances = false;
  }
  function syncSettlements() {
    autoSyncSettlements = true;
  }
  function manualEditSettlements() {
    autoSyncSettlements = false;
  }

  function addExpense(e: {
    payer: string;
    amount: number;
    participants: import("$lib/types").Participant[];
  }) {
    expenses = [
      ...expenses,
      { payer: e.payer, amount: e.amount, participants: e.participants },
    ];
  }
  function removeExpense(idx: number) {
    expenses = expenses.filter((_, i) => i !== idx);
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
    expenses = data.expenses;
    obligations = data.obligations;
    balances = data.balances;
    settlements = data.settlements;
    autoSyncObligations = data.autoSyncObligations;
    autoSyncBalances = data.autoSyncBalances;
    autoSyncSettlements = data.autoSyncSettlements;
  }

  type StepId = "expenses" | "obligations" | "balances" | "settlements";
  const steps: { id: StepId; label: string; done: boolean; active: boolean }[] =
    $derived([
      {
        id: "expenses",
        label: "Expenses",
        done: expenses.length > 0,
        active: true,
      },
      {
        id: "obligations",
        label: "Obligations",
        done: obligations.length > 0,
        active: expenses.length > 0,
      },
      {
        id: "balances",
        label: "Balances",
        done: balances.length > 0,
        active: obligations.length > 0,
      },
      {
        id: "settlements",
        label: "Settlements",
        done: settlements.length > 0,
        active: balances.length > 0,
      },
    ]);
</script>

<div
  class="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950"
>
  <Hero {steps} />

  <div class="mx-auto max-w-6xl px-4 pb-4 flex justify-end">
    <DataActions
      {expenses}
      {obligations}
      {balances}
      {settlements}
      {autoSyncObligations}
      {autoSyncBalances}
      {autoSyncSettlements}
      onImport={handleImport}
    />
  </div>

  <div class="mx-auto max-w-6xl space-y-6 px-4 pb-16">
    <!-- ══════════ STEP 1: EXPENSES ══════════ -->
    <SectionCard number={1} title="Expenses" accent="indigo">
      <ExpenseForm onaddexpense={addExpense} />
      <ExpenseTable bind:items={expenses} onremove={removeExpense} />
    </SectionCard>

    <!-- ══════════ STEP 2: OBLIGATIONS ══════════ -->
    <SectionCard number={2} title="Obligations" accent="violet">
      {#snippet actions()}
        <AutoSync
          autoSync={autoSyncObligations}
          onsync={syncObligations}
          accent="violet"
        />
      {/snippet}
      <FromToTable
        bind:items={obligations}
        accent="violet"
        onfocus={manualEditObligations}
        onremove={(i) => { obligations = obligations.filter((_, j) => j !== i); manualEditObligations(); }}
        emptyMessage="Obligations appear automatically when expenses are added"
      >
        {#snippet empty()}
          <DocumentIcon class="size-7 text-slate-600" />
        {/snippet}
      </FromToTable>
    </SectionCard>

    <!-- ══════════ STEP 3: BALANCES ══════════ -->
    <SectionCard number={3} title="Balances" accent="amber">
      {#snippet actions()}
        <AutoSync
          autoSync={autoSyncBalances}
          onsync={syncBalances}
          accent="amber"
        />
      {/snippet}
      <BalanceTable
        bind:items={balances}
        accent="amber"
        onfocus={manualEditBalances}
        onremove={(i) => { balances = balances.filter((_, j) => j !== i); manualEditBalances(); }}
        emptyMessage="Balances appear automatically when obligations are available"
      >
        {#snippet empty()}
          <CurrencyEuro class="size-7 text-slate-600" />
        {/snippet}
      </BalanceTable>
    </SectionCard>

    <!-- ══════════ STEP 4: SETTLEMENTS ══════════ -->
    <SectionCard number={4} title="Settlements" accent="emerald">
      {#snippet actions()}
        <AutoSync
          autoSync={autoSyncSettlements}
          onsync={syncSettlements}
          accent="emerald"
        />
      {/snippet}
      <FromToTable
        bind:items={settlements}
        accent="emerald"
        onfocus={manualEditSettlements}
        onremove={(i) => { settlements = settlements.filter((_, j) => j !== i); manualEditSettlements(); }}
        emptyMessage="Settlements appear automatically when balances are available"
      >
        {#snippet empty()}
          <CheckCircle class="size-7 text-slate-600" />
        {/snippet}
      </FromToTable>
    </SectionCard>
  </div>
</div>
