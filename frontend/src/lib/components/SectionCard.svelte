<script lang="ts">
  import type { Snippet } from "svelte";

  const badgeGradients: Record<string, string> = {
    indigo: "bg-linear-to-br from-indigo-500 to-violet-600",
    violet: "bg-linear-to-br from-violet-500 to-purple-600",
    amber: "bg-linear-to-br from-amber-500 to-orange-600",
    emerald: "bg-linear-to-br from-emerald-500 to-teal-600",
  };

  const shadowColors: Record<string, string> = {
    indigo: "shadow-indigo-500/30",
    violet: "shadow-violet-500/30",
    amber: "shadow-amber-500/30",
    emerald: "shadow-emerald-500/30",
  };

  let {
    number,
    title,
    accent = "indigo",
    children,
    actions,
  }: {
    number: number;
    title: string;
    accent?: string;
    children?: Snippet;
    actions?: Snippet;
  } = $props();

  const badgeClass = $derived(badgeGradients[accent] ?? badgeGradients.indigo);
  const shadowClass = $derived(shadowColors[accent] ?? shadowColors.indigo);
</script>

<section
  class="group/section rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80 sm:p-8"
>
  <div class="mb-6 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span
        class="flex size-8 items-center justify-center rounded-lg {badgeClass} text-xs font-bold text-white shadow-md {shadowClass}"
      >
        {number}
      </span>
      <h2 class="text-lg font-semibold text-slate-200">{title}</h2>
    </div>
    {#if actions}
      <div class="flex items-center gap-2">
        {@render actions()}
      </div>
    {/if}
  </div>
  {#if children}
    {@render children()}
  {/if}
</section>
