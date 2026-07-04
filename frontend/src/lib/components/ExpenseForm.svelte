<script lang="ts">
  import type { Participant } from "$lib/types";

  let newPayer = $state("");
  let newAmount = $state("");
  let newParticipants = $state<{ person: string; amount: string }[]>([
    { person: "", amount: "" },
  ]);

  function addParticipantField() {
    newParticipants = [...newParticipants, { person: "", amount: "" }];
  }
  function removeParticipantField(idx: number) {
    newParticipants = newParticipants.filter((_, i) => i !== idx);
  }

  let {
    onaddexpense,
  }: {
    onaddexpense?: (expense: {
      payer: string;
      amount: number;
      participants: Participant[];
    }) => void;
  } = $props();

  function addExpense() {
    const amountNum = Number.parseInt(newAmount, 10);
    if (!newPayer.trim() || Number.isNaN(amountNum) || amountNum <= 0) {
      return;
    }
    const participants: Participant[] = newParticipants
      .filter((p) => p.person.trim())
      .map((p) => ({
        person: p.person.trim(),
        amount: p.amount.trim() ? Number.parseInt(p.amount.trim(), 10) : null,
      }));
    if (participants.length === 0) {
      return;
    }
    onaddexpense?.({ payer: newPayer.trim(), amount: amountNum, participants });
    newPayer = "";
    newAmount = "";
    newParticipants = [{ person: "", amount: "" }];
  }
</script>

<div
  class="mb-6 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/40 p-5"
>
  <div class="mb-4 flex flex-wrap gap-3">
    <div class="flex-1 min-w-35">
      <label
        for="new-payer"
        class="mb-1 block text-xs font-medium text-slate-500 uppercase tracking-wider"
        >Payer</label
      >
      <input
        id="new-payer"
        type="text"
        placeholder="e.g. Alice"
        bind:value={newPayer}
        class="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
    </div>
    <div class="w-44">
      <label
        for="new-amount"
        class="mb-1 block text-xs font-medium text-slate-500 uppercase tracking-wider"
        >Amount</label
      >
      <div class="relative">
        <span
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-slate-500"
          >$</span
        >
        <input
          id="new-amount"
          type="number"
          placeholder="0.00"
          bind:value={newAmount}
          class="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 pl-7 pr-3.5 text-sm text-slate-200 placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
      </div>
    </div>
  </div>

  <span
    class="mb-2 block text-xs font-medium text-slate-500 uppercase tracking-wider"
    >Participants</span
  >
  <div class="space-y-2">
    {#each newParticipants as _, i}
      <div class="flex items-center gap-2">
        <input
          type="text"
          placeholder="Name"
          bind:value={newParticipants[i].person}
          class="flex-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        >
        <div class="relative w-36">
          <span
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-slate-600"
            >$</span
          >
          <input
            type="number"
            placeholder="optional"
            bind:value={newParticipants[i].amount}
            class="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-6 pr-3 text-sm text-slate-200 placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
        </div>
        <button
          onclick={() => removeParticipantField(i)}
          disabled={newParticipants.length <= 1}
          aria-label="Remove participant"
          class="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 disabled:opacity-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-4"
          >
            <path
              fill-rule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    {/each}
    <button
      onclick={addParticipantField}
      class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-4"
      >
        <path
          d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
        />
      </svg>
      Add participant
    </button>
  </div>

  <div class="mt-4 flex gap-3">
    <button
      onclick={addExpense}
      class="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.97]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-4"
      >
        <path
          d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
        />
      </svg>
      Add Expense
    </button>
  </div>
</div>
