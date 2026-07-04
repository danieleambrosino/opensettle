<script lang="ts">
  import type { Snippet } from "svelte";

  import CurrencyDollar from "$lib/components/icons/CurrencyDollar.svelte";

  let { message, children }: { message: string; children?: Snippet } = $props();
</script>

<div class="flex flex-col items-center justify-center py-10 text-center">
  <div
    class="mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-800/60 ring-1 ring-slate-700/50"
  >
    {#if children}
      {@render children()}
    {:else}
      <CurrencyDollar class="size-7 text-slate-600" />
    {/if}
  </div>
  <p class="text-sm text-slate-500">{message}</p>
</div>
