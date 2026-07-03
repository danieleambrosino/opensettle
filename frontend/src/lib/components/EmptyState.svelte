<script lang="ts">
  import type { Snippet } from "svelte";

  let { message, children }: { message: string; children?: Snippet } = $props();
</script>

<div class="flex flex-col items-center justify-center py-10 text-center">
  <div
    class="mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-800/60 ring-1 ring-slate-700/50"
  >
    {#if children}
      {@render children()}
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="size-7 text-slate-600"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    {/if}
  </div>
  <p class="text-sm text-slate-500">{message}</p>
</div>
