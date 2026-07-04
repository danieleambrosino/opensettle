<script lang="ts">
  import CurrencyEuro from "$lib/components/icons/CurrencyEuro.svelte";
  import Plus from "$lib/components/icons/Plus.svelte";
  import Trash from "$lib/components/icons/Trash.svelte";
  import type { Expense } from "$lib/types";
  import { personColor } from "$lib/utils";
  import Avatar from "./Avatar.svelte";
  import EmptyState from "./EmptyState.svelte";

  const focusRings: Record<string, string> = {
    indigo:
      "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
  };

  let {
    items = $bindable(),
    accent = "indigo",
    onfocus = () => {},
    onremove,
  }: {
    items: Expense[];
    accent?: string;
    onfocus?: () => void;
    onremove?: (index: number) => void;
  } = $props();

  const focusRing = $derived(focusRings[accent] ?? focusRings.indigo);

  function addParticipant(i: number) {
    items[i] = {
      ...items[i],
      participants: [...items[i].participants, { person: "", amount: null }],
    };
  }

  function removeParticipant(i: number, j: number) {
    items[i] = {
      ...items[i],
      participants: items[i].participants.filter((_, k) => k !== j),
    };
  }
</script>

{#if items.length > 0}
  <div class="overflow-hidden rounded-xl border border-slate-700/60">
    <table class="w-full">
      <thead>
        <tr class="border-b border-slate-700/60 bg-slate-800/60">
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Payer
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Amount
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Participants
          </th>
          <th
            class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400"
          ></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800">
        {#each items as _, i}
          <tr class="transition-colors duration-150 hover:bg-slate-800/40">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <Avatar name={items[i].payer} />
                <input
                  type="text"
                  bind:value={items[i].payer}
                  {onfocus}
                  class="w-24 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-sm text-slate-200 transition-all duration-200 {focusRing}"
                >
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="relative inline-block">
                <span
                  class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5"
                >
                  <CurrencyEuro
                    class="size-3.5 translate-y-px text-slate-600"
                  />
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={items[i].amount / 100}
                  oninput={(e) => {
                    const v = parseFloat(e.currentTarget.value);
                    if (!Number.isNaN(v)) items[i].amount = Math.round(v * 100);
                  }}
                  {onfocus}
                  class="w-28 rounded-lg border border-slate-700 bg-slate-800/60 py-1.5 pl-8 pr-2.5 text-sm font-medium text-slate-200 transition-all duration-200 {focusRing}"
                >
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-col gap-1.5">
                {#each items[i].participants as _, j}
                  <div class="flex items-center gap-1.5">
                    <span
                      class="inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-1.5 py-0.5 text-xs text-slate-300 ring-1 ring-slate-700/50"
                    >
                      <span
                        class="size-2.5 rounded-full"
                        style="background:{personColor(items[i].participants[j].person)}"
                      ></span>
                    </span>
                    <input
                      type="text"
                      placeholder="Name"
                      bind:value={items[i].participants[j].person}
                      {onfocus}
                      class="w-20 rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-200 placeholder-slate-600 transition-all duration-200 {focusRing}"
                    >
                    <div class="relative">
                      <span
                        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5"
                      >
                        <CurrencyEuro
                          class="size-3 translate-y-px text-slate-600"
                        />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="opt"
                        value={items[i].participants[j].amount !== null
                            ? items[i].participants[j].amount! / 100
                            : ""}
                        oninput={(e) => {
                          const raw = e.currentTarget.value;
                          if (raw === "") {
                            items[i].participants[j].amount = null;
                          } else {
                            const v = parseFloat(raw);
                            if (!Number.isNaN(v)) {
                              items[i].participants[j].amount =
                                Math.round(v * 100);
                            }
                          }
                        }}
                        {onfocus}
                        class="w-16 rounded-lg border border-slate-700 bg-slate-800/60 py-1 pl-6 pr-1.5 text-xs text-slate-200 placeholder-slate-600 transition-all duration-200 {focusRing}"
                      >
                    </div>
                    <button
                      onclick={() => removeParticipant(i, j)}
                      aria-label="Remove participant"
                      class="flex size-5 shrink-0 items-center justify-center rounded text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400"
                    >
                      <Trash />
                    </button>
                  </div>
                {/each}
                <button
                  onclick={() => addParticipant(i)}
                  class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  <Plus />
                  Add participant
                </button>
              </div>
            </td>
            <td class="px-4 py-3 text-right align-top">
              <button
                onclick={() => onremove?.(i)}
                aria-label="Remove expense"
                class="rounded-lg p-1.5 text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400"
              >
                <Trash />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <EmptyState message="No expenses yet — add one above" />
{/if}
