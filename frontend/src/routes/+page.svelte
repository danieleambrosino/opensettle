<script lang="ts">
  import AutoSync from "$lib/components/AutoSync.svelte";
  import BalanceTable from "$lib/components/BalanceTable.svelte";
  import ExpenseForm from "$lib/components/ExpenseForm.svelte";
  import ExpenseTable from "$lib/components/ExpenseTable.svelte";
  import FromToTable from "$lib/components/FromToTable.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import {
    computeBalances,
    computeMinimalSettlementSet,
    splitExpenses,
  } from "$lib/index";
  import type { Balance, Expense, Obligation, Settlement } from "$lib/types";

  let expenses = $state<Expense[]>([]);
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

  <div class="mx-auto max-w-6xl space-y-6 px-4 pb-16">
    <!-- ══════════ STEP 1: EXPENSES ══════════ -->
    <SectionCard number={1} title="Expenses" accent="indigo">
      <ExpenseForm onaddexpense={addExpense} />
      <ExpenseTable {expenses} onremove={removeExpense} />
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            class="size-7 text-slate-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            class="size-7 text-slate-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            class="size-7 text-slate-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        {/snippet}
      </FromToTable>
    </SectionCard>
  </div>
</div>
