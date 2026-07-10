import { type Element, For, Show } from "solid-js";
import Avatar from "@/lib/components/avatar";
import EmptyState from "@/lib/components/empty-state";
import CurrencyEuro from "@/lib/components/icons/currency-euro";
import Trash from "@/lib/components/icons/trash";
import type { Transaction } from "@/lib/types";

interface Props {
  accent?: string;
  children?: Element;
  emptyMessage?: string;
  items: Transaction[];
  onfocus?: () => void;
  onItemsChange: (items: Transaction[]) => void;
  onRemove?: (index: number) => void;
}

export default function FromToTable(props: Props) {
  function updateField(
    i: number,
    field: keyof Transaction,
    value: string | number
  ) {
    props.onItemsChange(
      props.items.map((item, j) =>
        j === i ? { ...item, [field]: value } : item
      )
    );
  }

  function updateAmount(i: number, raw: string) {
    const v = Number.parseFloat(raw);
    if (!Number.isNaN(v)) {
      updateField(i, "amount", Math.round(v * 100));
    }
  }

  return (
    <>
      <Show when={props.items.length > 0}>
        <div class="overflow-x-auto rounded-xl border border-slate-700/60">
          <table class="w-full">
            <thead>
              <tr class="border-slate-700/60 border-b bg-slate-800/60">
                <th class="px-4 py-3 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider">
                  From
                </th>
                <th class="px-4 py-3 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider">
                  To
                </th>
                <th class="px-4 py-3 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-4 py-3 text-right" />
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <For each={props.items} keyed={false}>
                {(item, i) => (
                  <tr class="transition-colors duration-150 hover:bg-slate-800/40">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2.5">
                        <Avatar name={item().from} />
                        <input
                          class={[
                            "min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-slate-200 text-sm transition-all duration-200 max-sm:max-w-20 sm:w-24",
                            {
                              "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30":
                                props.accent === "emerald",
                              "focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30":
                                props.accent !== "emerald",
                            },
                          ]}
                          onFocus={props.onfocus}
                          onInput={(e) =>
                            updateField(i, "from", e.currentTarget.value)
                          }
                          type="text"
                          value={item().from}
                        />
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2.5">
                        <Avatar name={item().to} />
                        <input
                          class={[
                            "min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-slate-200 text-sm transition-all duration-200 max-sm:max-w-20 sm:w-24",
                            {
                              "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30":
                                props.accent === "emerald",
                              "focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30":
                                props.accent !== "emerald",
                            },
                          ]}
                          onFocus={props.onfocus}
                          onInput={(e) =>
                            updateField(i, "to", e.currentTarget.value)
                          }
                          type="text"
                          value={item().to}
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
                            "min-w-0 rounded-lg border border-slate-700 bg-slate-800/60 py-1.5 pr-2.5 pl-8 font-medium text-slate-200 text-sm transition-all duration-200 max-sm:w-24 sm:w-28",
                            {
                              "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30":
                                props.accent === "emerald",
                              "focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30":
                                props.accent !== "emerald",
                            },
                          ]}
                          onFocus={props.onfocus}
                          onInput={(e) =>
                            updateAmount(i, e.currentTarget.value)
                          }
                          step="0.01"
                          type="number"
                          value={item().amount / 100}
                        />
                      </div>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <button
                        aria-label="Remove row"
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
      <Show when={props.items.length === 0 && props.children}>
        <EmptyState message={props.emptyMessage ?? "No items yet"}>
          {props.children}
        </EmptyState>
      </Show>
    </>
  );
}
