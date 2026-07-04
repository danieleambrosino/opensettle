<script lang="ts">
  import type { Snippet } from "svelte";
  import Avatar from "./Avatar.svelte";

  interface Item {
    amount: number;
    from: string;
    to: string;
  }

  import CurrencyEuro from "$lib/components/icons/CurrencyEuro.svelte";
  import Trash from "$lib/components/icons/Trash.svelte";

  const focusRings: Record<string, string> = {
    violet:
      "focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30",
    emerald:
      "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
  };

  let {
    items = $bindable(),
    accent = "violet",
    onfocus = () => {},
    onremove,
    empty,
    emptyMessage = "No items yet",
  }: {
    items: Item[];
    accent?: string;
    onfocus?: () => void;
    onremove?: (index: number) => void;
    empty?: Snippet;
    emptyMessage?: string;
  } = $props();

  const focusRing = $derived(focusRings[accent] ?? focusRings.violet);
</script>

{#if items.length > 0}
  <div class="overflow-hidden rounded-xl border border-slate-700/60">
    <table class="w-full">
      <thead>
        <tr class="border-b border-slate-700/60 bg-slate-800/60">
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            From
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            To
          </th>
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Amount
          </th>
          <th class="px-4 py-3 text-right"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800">
        {#each items as _, i}
          <tr class="transition-colors duration-150 hover:bg-slate-800/40">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <Avatar name={items[i].from} />
                <input
                  type="text"
                  bind:value={items[i].from}
                  {onfocus}
                  class="w-24 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-sm text-slate-200 transition-all duration-200 {focusRing}"
                >
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <Avatar name={items[i].to} />
                <input
                  type="text"
                  bind:value={items[i].to}
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
            <td class="px-4 py-3 text-right">
              <button
                onclick={() => onremove?.(i)}
                aria-label="Remove row"
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
