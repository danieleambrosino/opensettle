<script lang="ts">
  const syncGradients: Record<string, string> = {
    violet:
      "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
    amber:
      "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
    emerald:
      "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
  };

  const shadowColors: Record<string, string> = {
    violet: "shadow-violet-600/20",
    amber: "shadow-amber-600/20",
    emerald: "shadow-emerald-600/20",
  };

  import Sync from "$lib/components/icons/sync.svelte";

  let {
    autoSync,
    onsync,
    accent = "violet",
  }: {
    autoSync: boolean;
    onsync: () => void;
    accent?: string;
  } = $props();

  const syncGrad = $derived(syncGradients[accent] ?? syncGradients.violet);
  const shadow = $derived(shadowColors[accent] ?? shadowColors.violet);
</script>

{#if !autoSync}
  <button
    type="button"
    onclick={onsync}
    class="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r {syncGrad} px-3.5 py-2 text-xs font-semibold text-white shadow-lg {shadow} transition-all duration-200 active:scale-[0.97]"
  >
    <Sync />
    Sync
  </button>
{:else}
  <span
    class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20"
  >
    <span class="relative flex size-2">
      <span
        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
      ></span>
      <span
        class="relative inline-flex size-2 rounded-full bg-emerald-500"
      ></span>
    </span>
    Auto-sync
  </span>
{/if}
