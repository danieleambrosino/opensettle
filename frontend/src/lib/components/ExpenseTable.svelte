<script lang="ts">
  import Trash from "$lib/components/icons/Trash.svelte";
  import type { Expense } from "$lib/types";
  import { fmt, personColor } from "$lib/utils";
  import Avatar from "./Avatar.svelte";
  import EmptyState from "./EmptyState.svelte";

  let {
    expenses,
    onremove,
  }: {
    expenses: Expense[];
    onremove?: (index: number) => void;
  } = $props();
</script>

{#if expenses.length > 0}
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
        {#each expenses as expense, i}
          <tr class="transition-colors duration-150 hover:bg-slate-800/40">
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2.5">
                <Avatar name={expense.payer} />
                <span class="text-sm font-medium text-slate-200"
                  >{expense.payer}</span
                >
              </div>
            </td>
            <td class="px-4 py-3.5 text-sm font-semibold text-slate-200">
              {fmt(expense.amount)}
            </td>
            <td class="px-4 py-3.5">
              <div class="flex flex-wrap gap-1.5">
                {#each expense.participants as p}
                  <span
                    class="inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-slate-700/50"
                  >
                    <span
                      class="size-3 rounded-full"
                      style="background:{personColor(p.person)}"
                    ></span>
                    {p.person}
                    {#if p.amount !== null}
                      <span class="text-slate-500">({fmt(p.amount)})</span>
                    {/if}
                  </span>
                {/each}
              </div>
            </td>
            <td class="px-4 py-3.5 text-right">
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
