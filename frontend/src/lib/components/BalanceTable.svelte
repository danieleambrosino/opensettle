<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Balance } from "$lib/types";
  import Avatar from "./Avatar.svelte";

  let {
    items = $bindable(),
    accent = "amber",
    onfocus = () => {},
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
</script>

{#if items.length > 0}
  <div class="overflow-hidden rounded-xl border border-slate-700/60">
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
          <tr class="transition-colors duration-150 hover:bg-slate-800/40">
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2.5">
                <Avatar name={items[i].person} />
                <input
                  type="text"
                  bind:value={items[i].person}
                  {onfocus}
                  class="w-24 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-sm text-slate-200 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  bind:value={items[i].amount}
                  {onfocus}
                  class={[
                    "w-28 rounded-lg border border-slate-700 bg-slate-800/60 py-1.5 px-2.5 text-sm font-mono font-medium transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30",
                    items[i].amount < 0 && "text-red-400",
                    items[i].amount > 0 && "text-emerald-400",
                    items[i].amount === 0 && "text-slate-400",
                  ]}
                >
                <span
                  class={[
                  "text-xs font-medium",
                  items[i].amount < 0 && "text-red-400",
                  items[i].amount > 0 && "text-emerald-400",
                  items[i].amount === 0 && "text-slate-500",
                ]}
                >
                  {items[i].amount < 0 ? "owes" : items[i].amount > 0 ? "owed" : "settled"}
                </span>
              </div>
            </td>
            <td class="px-4 py-3.5 text-right">
              <button
                onclick={() => onremove?.(i)}
                aria-label="Remove balance"
                class="rounded-lg p-1.5 text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400"
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
