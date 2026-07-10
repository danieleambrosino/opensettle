import { For, Show } from "solid-js";
import Avatar from "@/lib/components/avatar";
import EmptyState from "@/lib/components/empty-state";
import CurrencyEuro from "@/lib/components/icons/currency-euro";
import Plus from "@/lib/components/icons/plus";
import Trash from "@/lib/components/icons/trash";
import type { Expense } from "@/lib/types";
import { personColor } from "@/lib/utils";

interface Props {
  items: Expense[];
  onItemsChange: (items: Expense[]) => void;
  onRemove?: (index: number) => void;
}

export default function ExpenseTable(props: Props) {
  function updateItem(i: number, updater: (exp: Expense) => Expense) {
    props.onItemsChange(
      props.items.map((exp, j) => (j === i ? updater(exp) : exp))
    );
  }

  function addParticipant(i: number) {
    updateItem(i, (exp) => ({
      ...exp,
      participants: [...exp.participants, { amount: null, person: "" }],
    }));
  }

  function removeParticipant(i: number, j: number) {
    updateItem(i, (exp) => ({
      ...exp,
      participants: exp.participants.filter((_, k) => k !== j),
    }));
  }

  return (
    <Show
      fallback={<EmptyState message="No expenses yet — add one above" />}
      when={props.items.length > 0}
    >
      <div class="overflow-x-auto rounded-xl border border-slate-700/60">
        <table class="w-full">
          <thead>
            <tr class="border-slate-700/60 border-b bg-slate-800/60">
              <th class="px-4 py-3 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider">
                Payer
              </th>
              <th class="px-4 py-3 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider">
                Amount
              </th>
              <th class="px-4 py-3 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider">
                Participants
              </th>
              <th class="px-4 py-3 text-right font-semibold text-slate-400 text-xs uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <For each={props.items} keyed={false}>
              {(item, i) => (
                <tr class="transition-colors duration-150 hover:bg-slate-800/40">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2.5">
                      <Avatar name={item().payer} />
                      <input
                        class={[
                          "min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-slate-200 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 max-sm:max-w-20 sm:w-24",
                        ]}
                        onInput={(e) =>
                          updateItem(i, (exp) => ({
                            ...exp,
                            payer: e.currentTarget.value,
                          }))
                        }
                        type="text"
                        value={item().payer}
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="relative inline-block">
                      <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                        <CurrencyEuro class="size-3.5 translate-y-px text-slate-600" />
                      </span>
                      <input
                        class={[
                          "min-w-0 rounded-lg border border-slate-700 bg-slate-800/60 py-1.5 pr-2.5 pl-8 font-medium text-slate-200 text-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 max-sm:w-24 sm:w-28",
                        ]}
                        onInput={(e) => {
                          const v = Number.parseFloat(e.currentTarget.value);
                          if (!Number.isNaN(v)) {
                            updateItem(i, (exp) => ({
                              ...exp,
                              amount: Math.round(v * 100),
                            }));
                          }
                        }}
                        step="0.01"
                        type="number"
                        value={item().amount / 100}
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-col gap-1.5">
                      <For each={item().participants} keyed={false}>
                        {(participant, j) => {
                          const { amount } = participant();
                          return (
                            <div class="flex items-center gap-1.5">
                              <span class="inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-1.5 py-0.5 text-slate-300 text-xs ring-1 ring-slate-700/50">
                                <span
                                  class="size-2.5 rounded-full"
                                  style={{
                                    background: personColor(
                                      participant().person
                                    ),
                                  }}
                                />
                              </span>
                              <input
                                class={[
                                  "min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1 text-slate-200 text-xs placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 max-sm:max-w-16 sm:w-20",
                                ]}
                                onInput={(e) => {
                                  const val = e.currentTarget.value;
                                  updateItem(i, (exp) => ({
                                    ...exp,
                                    participants: exp.participants.map(
                                      (p, k) =>
                                        k === j ? { ...p, person: val } : p
                                    ),
                                  }));
                                }}
                                placeholder="Name"
                                type="text"
                                value={participant().person}
                              />
                              <div class="relative">
                                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5">
                                  <CurrencyEuro class="size-3 translate-y-px text-slate-600" />
                                </span>
                                <input
                                  class={[
                                    "min-w-0 rounded-lg border border-slate-700 bg-slate-800/60 py-1 pr-1.5 pl-6 text-slate-200 text-xs placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 max-sm:w-14 sm:w-16",
                                  ]}
                                  onInput={(e) => {
                                    const raw = e.currentTarget.value;
                                    updateItem(i, (exp) => ({
                                      ...exp,
                                      participants: exp.participants.map(
                                        (p, k) =>
                                          k === j
                                            ? {
                                                ...p,
                                                amount:
                                                  raw === ""
                                                    ? null
                                                    : Math.round(
                                                        Number.parseFloat(raw) *
                                                          100
                                                      ),
                                              }
                                            : p
                                      ),
                                    }));
                                  }}
                                  placeholder="opt"
                                  step="0.01"
                                  type="number"
                                  value={amount === null ? "" : amount / 100}
                                />
                              </div>
                              <button
                                aria-label="Remove participant"
                                class="flex size-7 shrink-0 items-center justify-center rounded text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:bg-red-500/25"
                                onClick={() => removeParticipant(i, j)}
                                type="button"
                              >
                                <Trash />
                              </button>
                            </div>
                          );
                        }}
                      </For>
                      <button
                        class="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-indigo-400 text-xs transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-300 active:bg-indigo-500/20"
                        onClick={() => addParticipant(i)}
                        type="button"
                      >
                        <Plus />
                        Add participant
                      </button>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right align-top">
                    <button
                      aria-label="Remove expense"
                      class="rounded-lg p-2.5 text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:bg-red-500/25"
                      onClick={() => props.onRemove?.(i)}
                      type="button"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </Show>
  );
}
