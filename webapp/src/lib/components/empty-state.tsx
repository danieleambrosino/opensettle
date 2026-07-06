import { type JSX, Show } from "solid-js";
import CurrencyEuro from "@/lib/components/icons/currency-euro";

interface Props {
  children?: JSX.Element;
  message: string;
}

export default function EmptyState(props: Props) {
  return (
    <div class="flex flex-col items-center justify-center py-10 text-center">
      <div class="mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-800/60 ring-1 ring-slate-700/50">
        <Show
          fallback={<CurrencyEuro class="size-7 text-slate-600" />}
          when={props.children}
        >
          {props.children}
        </Show>
      </div>
      <p class="text-slate-500 text-sm">{props.message}</p>
    </div>
  );
}
