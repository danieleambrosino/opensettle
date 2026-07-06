import { Index, type JSX, Show } from "solid-js";
import Avatar from "@/lib/components/avatar";
import EmptyState from "@/lib/components/empty-state";
import CurrencyEuro from "@/lib/components/icons/currency-euro";
import Trash from "@/lib/components/icons/trash";
import type { Balance } from "@/lib/types";

interface Props {
  children?: JSX.Element;
  emptyMessage?: string;
  items: Balance[];
  onfocus?: () => void;
  onItemsChange: (items: Balance[]) => void;
  onRemove?: (index: number) => void;
}

function statusLabel(amount: number): string {
  if (amount < 0) {
    return "owes";
  }
  if (amount > 0) {
    return "owed";
  }
  return "settled";
}

export default function BalanceTable(props: Props) {
  function updateField(
    i: number,
    field: keyof Balance,
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
                  Person
                </th>
                <th class="px-4 py-3 text-left font-semibold text-slate-400 text-xs uppercase tracking-wider">
                  Balance
                </th>
                <th class="px-4 py-3 text-right" />
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <Index each={props.items}>
                {(item, i) => (
                  <tr class="transition-colors duration-150 hover:bg-slate-800/40">
                    <td class="px-4 py-3.5">
                      <div class="flex items-center gap-2.5">
                        <Avatar name={item().person} />
                        <input
                          class="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-slate-200 text-sm transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 max-sm:max-w-20 sm:w-24"
                          onFocus={props.onfocus}
                          onInput={(e) =>
                            updateField(i, "person", e.currentTarget.value)
                          }
                          type="text"
                          value={item().person}
                        />
                      </div>
                    </td>
                    <td class="px-4 py-3.5">
                      <div class="flex items-center gap-2">
                        <div class="relative inline-block">
                          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                            <CurrencyEuro class="size-3.5 translate-y-px text-slate-600" />
                          </span>
                          <input
                            classList={{
                              "min-w-0 rounded-lg border border-slate-700 bg-slate-800/60 py-1.5 pr-2.5 pl-8 font-medium font-mono text-sm transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 max-sm:w-24 sm:w-28": true,
                              "text-emerald-400": item().amount > 0,
                              "text-red-400": item().amount < 0,
                              "text-slate-400": item().amount === 0,
                            }}
                            onFocus={props.onfocus}
                            onInput={(e) =>
                              updateAmount(i, e.currentTarget.value)
                            }
                            step="0.01"
                            type="number"
                            value={item().amount / 100}
                          />
                        </div>
                        <span
                          classList={{
                            "font-medium text-xs": true,
                            "text-emerald-400": item().amount > 0,
                            "text-red-400": item().amount < 0,
                            "text-slate-500": item().amount === 0,
                          }}
                        >
                          {statusLabel(item().amount)}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3.5 text-right">
                      <button
                        aria-label="Remove balance"
                        class="rounded-lg p-2.5 text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:bg-red-500/25"
                        onClick={() => props.onRemove?.(i)}
                        type="button"
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                )}
              </Index>
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
