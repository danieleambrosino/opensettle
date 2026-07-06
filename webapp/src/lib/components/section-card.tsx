import { type JSX, Show } from "solid-js";

interface Props {
  accent?: string;
  actions?: JSX.Element;
  children?: JSX.Element;
  number: number;
  title: string;
}

export default function SectionCard(props: Props) {
  const accent = props.accent ?? "indigo";

  return (
    <section class="group/section rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-black/20 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80 sm:p-8">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span
            classList={{
              "bg-linear-to-br from-amber-500 to-orange-600 shadow-amber-500/30":
                accent === "amber",
              "bg-linear-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30":
                accent === "emerald",
              "bg-linear-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30":
                accent === "indigo",
              "bg-linear-to-br from-violet-500 to-purple-600 shadow-violet-500/30":
                accent === "violet",
              "flex size-8 items-center justify-center rounded-lg font-bold text-white text-xs shadow-md": true,
            }}
          >
            {props.number}
          </span>
          <h2 class="font-semibold text-lg text-slate-200">{props.title}</h2>
        </div>
        <Show when={props.actions}>
          <div class="flex items-center gap-2">{props.actions}</div>
        </Show>
      </div>
      {props.children}
    </section>
  );
}
