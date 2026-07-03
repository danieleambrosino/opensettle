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
    onclick={onsync}
    class="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r {syncGrad} px-3.5 py-2 text-xs font-semibold text-white shadow-lg {shadow} transition-all duration-200 active:scale-[0.97]"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="size-4"
    >
      <path
        fill-rule="evenodd"
        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
        clip-rule="evenodd"
      />
    </svg>
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
