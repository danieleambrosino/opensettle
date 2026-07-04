<script lang="ts">
  import DocumentIcon from "$lib/components/icons/document.svelte";
  import SyncIcon from "$lib/components/icons/sync.svelte";
  import type { Balance, Expense, Obligation, Settlement } from "$lib/types";

  interface ImportData {
    autoSyncBalances: boolean;
    autoSyncObligations: boolean;
    autoSyncSettlements: boolean;
    balances: Balance[];
    expenses: Expense[];
    obligations: Obligation[];
    settlements: Settlement[];
    version: 1;
  }

  let {
    expenses = [],
    obligations = [],
    balances = [],
    settlements = [],
    autoSyncObligations = true,
    autoSyncBalances = true,
    autoSyncSettlements = true,
    onImport,
  }: {
    expenses: Expense[];
    obligations: Obligation[];
    balances: Balance[];
    settlements: Settlement[];
    autoSyncObligations: boolean;
    autoSyncBalances: boolean;
    autoSyncSettlements: boolean;
    onImport: (data: ImportData) => void;
  } = $props();

  let fileInput = $state<HTMLInputElement>();

  function handleExport() {
    const data: ImportData = {
      autoSyncBalances,
      autoSyncObligations,
      autoSyncSettlements,
      balances,
      expenses,
      obligations,
      settlements,
      version: 1,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "opensettle-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const file = fileInput.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ImportData;
        if (data.version !== 1) {
          throw new Error("unsupported file version");
        }
        onImport(data);
      } catch (err) {
        console.error(`Import failed: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
    if (fileInput) {
      fileInput.value = "";
    }
  }
</script>

<div class="flex items-center gap-2">
  <input
    bind:this={fileInput}
    type="file"
    accept=".json"
    onchange={handleImport}
    class="hidden"
  >
  <button
    type="button"
    onclick={() => fileInput?.click()}
    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-slate-600 hover:bg-slate-700/40 hover:text-slate-300"
  >
    <SyncIcon class="size-3.5" />
    Import
  </button>
  <button
    type="button"
    onclick={handleExport}
    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-slate-600 hover:bg-slate-700/40 hover:text-slate-300"
  >
    <DocumentIcon class="size-3.5" />
    Export
  </button>
</div>
