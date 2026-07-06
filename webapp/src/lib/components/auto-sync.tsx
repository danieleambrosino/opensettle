import { Show } from "solid-js";
import Sync from "@/lib/components/icons/sync";

interface Props {
  accent?: string;
  autoSync: boolean;
  onsync: () => void;
}

export default function AutoSync(props: Props) {
  return (
    <Show
      fallback={
        <button
          classList={{
            "from-amber-600 to-orange-600 shadow-amber-600/20 hover:from-amber-500 hover:to-orange-500":
              props.accent === "amber",
            "from-emerald-600 to-teal-600 shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500":
              props.accent === "emerald",
            "from-violet-600 to-purple-600 shadow-violet-600/20 hover:from-violet-500 hover:to-purple-500":
              !props.accent || props.accent === "violet",
            "inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r px-3.5 py-2 font-semibold text-white text-xs shadow-lg transition-all duration-200 active:scale-[0.97]": true,
          }}
          onClick={props.onsync}
          type="button"
        >
          <Sync />
          Sync
        </button>
      }
      when={props.autoSync}
    >
      <span class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 font-medium text-emerald-400 text-xs ring-1 ring-emerald-500/20">
        <span class="relative flex size-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        Auto-sync
      </span>
    </Show>
  );
}
