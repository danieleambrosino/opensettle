import { createSignal, Index } from "solid-js";
import CurrencyEuro from "@/lib/components/icons/currency-euro";
import Plus from "@/lib/components/icons/plus";
import Trash from "@/lib/components/icons/trash";
import type { Expense, Participant } from "@/lib/types";

interface Props {
  onAddExpense?: (expense: Expense) => void;
}

interface FieldParticipant {
  amount: string;
  person: string;
}

export default function ExpenseForm(props: Props) {
  const [newPayer, setNewPayer] = createSignal("");
  const [newAmount, setNewAmount] = createSignal("");
  const [newParticipants, setNewParticipants] = createSignal<
    FieldParticipant[]
  >([{ amount: "", person: "" }]);

  function addParticipantField() {
    setNewParticipants([...newParticipants(), { amount: "", person: "" }]);
  }

  function removeParticipantField(idx: number) {
    setNewParticipants(newParticipants().filter((_, i) => i !== idx));
  }

  function updateParticipantField(
    idx: number,
    field: keyof FieldParticipant,
    value: string
  ) {
    setNewParticipants(
      newParticipants().map((p, i) =>
        i === idx ? { ...p, [field]: value } : p
      )
    );
  }

  function addExpense() {
    const amountNum = Math.round(Number.parseFloat(newAmount()) * 100);
    if (!newPayer().trim() || Number.isNaN(amountNum) || amountNum <= 0) {
      return;
    }
    const participants: Participant[] = newParticipants()
      .filter((p) => p.person.trim())
      .map((p) => ({
        amount: p.amount.trim()
          ? Math.round(Number.parseFloat(p.amount.trim()) * 100)
          : null,
        person: p.person.trim(),
      }));
    if (participants.length === 0) {
      return;
    }
    props.onAddExpense?.({
      amount: amountNum,
      participants,
      payer: newPayer().trim(),
    });
    setNewPayer("");
    setNewAmount("");
    setNewParticipants([{ amount: "", person: "" }]);
  }

  return (
    <div class="mb-6 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/40 p-5">
      <div class="mb-4 flex flex-wrap gap-3">
        <div class="min-w-35 flex-1">
          <label
            class="mb-1 block font-medium text-slate-500 text-xs uppercase tracking-wider"
            for="new-payer"
          >
            Payer
          </label>
          <input
            class="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-slate-200 text-sm placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            id="new-payer"
            onInput={(e) => setNewPayer(e.currentTarget.value)}
            placeholder="e.g. Alice"
            type="text"
            value={newPayer()}
          />
        </div>
        <div class="w-44">
          <label
            class="mb-1 block font-medium text-slate-500 text-xs uppercase tracking-wider"
            for="new-amount"
          >
            Amount
          </label>
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              <CurrencyEuro class="size-3.5 translate-y-px text-slate-500" />
            </span>
            <input
              class="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2.5 pr-3.5 pl-8 text-slate-200 text-sm placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              id="new-amount"
              onInput={(e) => setNewAmount(e.currentTarget.value)}
              placeholder="0.00"
              type="number"
              value={newAmount()}
            />
          </div>
        </div>
      </div>

      <span class="mb-2 block font-medium text-slate-500 text-xs uppercase tracking-wider">
        Participants
      </span>
      <div class="space-y-2">
        <Index each={newParticipants()}>
          {(item, i) => (
            <div class="flex items-center gap-2">
              <input
                class="flex-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-slate-200 text-sm placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                onInput={(e) =>
                  updateParticipantField(i, "person", e.currentTarget.value)
                }
                placeholder="Name"
                type="text"
                value={item().person}
              />
              <div class="relative w-36">
                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                  <CurrencyEuro class="size-3.5 translate-y-px text-slate-600" />
                </span>
                <input
                  class="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pr-3 pl-8 text-slate-200 text-sm placeholder-slate-600 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  onInput={(e) =>
                    updateParticipantField(i, "amount", e.currentTarget.value)
                  }
                  placeholder="optional"
                  type="number"
                  value={item().amount}
                />
              </div>
              <button
                aria-label="Remove participant"
                class="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 disabled:opacity-20"
                disabled={newParticipants().length <= 1}
                onClick={() => removeParticipantField(i)}
                type="button"
              >
                <Trash />
              </button>
            </div>
          )}
        </Index>
        <button
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-indigo-400 text-xs transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-300"
          onClick={addParticipantField}
          type="button"
        >
          <Plus />
          Add participant
        </button>
      </div>

      <div class="mt-4 flex gap-3">
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2.5 font-semibold text-sm text-white shadow-indigo-600/25 shadow-lg transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 hover:shadow-xl active:scale-[0.97]"
          onClick={addExpense}
          type="button"
        >
          <Plus />
          Add Expense
        </button>
      </div>
    </div>
  );
}
