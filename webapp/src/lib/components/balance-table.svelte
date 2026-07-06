<script lang="ts">
  import type { Snippet } from "svelte";
  import CurrencyEuro from "$lib/components/icons/currency-euro.svelte";
  import Trash from "$lib/components/icons/trash.svelte";
  import type { Balance } from "$lib/types";
  import Avatar from "./avatar.svelte";

  let {
    items = $bindable(),
    accent = "amber",
    onfocus,
    onremove,
    empty,
    emptyMessage = "No items yet",
  }: {
    items: Balance[];
    accent?: string;
    onfocus?: () => void;
    onremove?: (index: number) => void;
    empty?: Snippet;
    emptyMessage?: string;
  } = $props();

  function statusLabel(amount: number): string {
    if (amount < 0) {
      return "owes";
    }
    if (amount > 0) {
      return "owed";
    }
    return "settled";
  }
</script>

{#if items.length > 0}
  <div class="overflow-x-auto rounded-xl border border-slate-700/60">
    <table class="w-full">
      <thead>
        <tr class="border-b border-slate-700/60 bg-slate-800/60">
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Person
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Balance
          </th>
          <th class="px-4 py-3 text-right"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800">
        {#each items as _, i}
          <tr class="transition-colors duration-150">
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2.5">
                <Avatar name={items[i].person} />
                <input
                  type="text"
                  bind:value={items[i].person}
                  {onfocus}
                  class="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-sm text-slate-200 transition-all duration-200 max-sm:max-w-20 sm:w-24 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
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
                      const v = Number.parseFloat(e.currentTarget.value);
                      if (!Number.isNaN(v)) { items[i].amount = Math.round(v * 100); }
                    }}
                    {onfocus}
                    class={[
                      "min-w-0 rounded-lg border border-slate-700 bg-slate-800/60 py-1.5 pl-8 pr-2.5 text-sm font-mono font-medium transition-all duration-200 max-sm:w-24 sm:w-28 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30",
                      items[i].amount < 0 && "text-red-400",
                      items[i].amount > 0 && "text-emerald-400",
                      items[i].amount === 0 && "text-slate-400",
                    ]}
                  >
                </div>
                <span
                  class={[
                  "text-xs font-medium",
                  items[i].amount < 0 && "text-red-400",
                  items[i].amount > 0 && "text-emerald-400",
                  items[i].amount === 0 && "text-slate-500",
                ]}
                >
                  {statusLabel(items[i].amount)}
                </span>
              </div>
            </td>
            <td class="px-4 py-3.5 text-right">
              <button
                type="button"
                onclick={() => onremove?.(i)}
                aria-label="Remove balance"
                class="rounded-lg p-2.5 text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:bg-red-500/25"
              >
                <Trash />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else if empty}
  <div class="flex flex-col items-center justify-center py-10 text-center">
    <div
      class="mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-800/60 ring-1 ring-slate-700/50"
    >
      {@render empty()}
    </div>
    <p class="text-sm text-slate-500">{emptyMessage}</p>
  </div>
{/if}

<style>
  @media (hover: hover) {
    tbody tr:hover {
      background-color: rgba(30, 41, 59, 0.4);
    }
  }
</style>
