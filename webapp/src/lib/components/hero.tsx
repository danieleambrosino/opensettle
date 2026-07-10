import { For, Show } from "solid-js";

interface Step {
  active: boolean;
  done: boolean;
  id: string;
  label: string;
}

interface Props {
  steps: Step[];
}

export default function Hero(props: Props) {
  return (
    <div class="mx-auto max-w-6xl px-4 pt-12 pb-4">
      <div class="text-center">
        <h1 class="bg-linear-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text font-black text-4xl text-transparent tracking-tight sm:text-5xl">
          OpenSettle
        </h1>
        <p class="mt-2 text-slate-500 text-sm">
          Split expenses, balance debts, settle up
        </p>
      </div>

      <div class="mt-8 flex items-center justify-start gap-0 overflow-x-auto px-2 sm:justify-center sm:overflow-visible sm:px-0">
        <For each={props.steps}>
          {(step, i) => (
            <div class="flex items-center">
              <div class="flex flex-col items-center gap-1.5">
                <div
                  class={[
                    "flex size-8 items-center justify-center rounded-full font-bold text-xs transition-all duration-300",
                    {
                      "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30 shadow-lg":
                        step.done,
                      "border border-slate-600 bg-slate-800/60 text-slate-400":
                        !step.done && step.active,
                      "border border-slate-800 bg-slate-900/40 text-slate-700":
                        !(step.done || step.active),
                    },
                  ]}
                >
                  {step.done ? "\u2713" : i() + 1}
                </div>
                <span
                  class={[
                    "whitespace-nowrap font-medium text-[11px] uppercase tracking-wider",
                    {
                      "text-emerald-400": step.done,
                      "text-slate-400": !step.done && step.active,
                      "text-slate-700": !(step.done || step.active),
                    },
                  ]}
                >
                  {step.label}
                </span>
              </div>
              <Show when={i() < props.steps.length - 1}>
                <div
                  class={[
                    "mx-2 mb-5 h-px w-12 sm:w-20",
                    {
                      "bg-linear-to-r from-emerald-500/80 to-slate-600":
                        step.done,
                      "bg-slate-800": !step.done,
                    },
                  ]}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
