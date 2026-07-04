<script lang="ts">
  let {
    steps,
  }: {
    steps: { id: string; label: string; done: boolean; active: boolean }[];
  } = $props();
</script>

<div class="mx-auto max-w-6xl px-4 pt-12 pb-4">
  <div class="text-center">
    <h1
      class="bg-linear-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl"
    >
      Settlement Calculator
    </h1>
    <p class="mt-2 text-sm text-slate-500">
      Split expenses, balance debts, settle up
    </p>
  </div>

  <div class="mt-8 flex items-center justify-center gap-0">
    {#each steps as step, i}
      <div class="flex items-center">
        <div class="flex flex-col items-center gap-1.5">
          <div
            class={[
              "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
              step.done && "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
              !step.done && step.active && "border border-slate-600 bg-slate-800/60 text-slate-400",
              !step.done && !step.active && "border border-slate-800 bg-slate-900/40 text-slate-700",
            ]}
          >
            {step.done ? "\u2713" : i + 1}
          </div>
          <span
            class={[
              "whitespace-nowrap text-[10px] font-medium uppercase tracking-wider",
              step.done && "text-emerald-400",
              !step.done && step.active && "text-slate-400",
              !step.done && !step.active && "text-slate-700",
            ]}
          >
            {step.label}
          </span>
        </div>
        {#if i < steps.length - 1}
          <div
            class={[
              "mx-2 mb-5 h-px w-12 sm:w-20",
              step.done && "bg-linear-to-r from-emerald-500/80 to-slate-600",
              !step.done && "bg-slate-800",
            ]}
          ></div>
        {/if}
      </div>
    {/each}
  </div>
</div>
