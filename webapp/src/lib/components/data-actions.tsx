import DocumentArrowDown from "@/lib/components/icons/document-arrow-down";
import DocumentArrowUp from "@/lib/components/icons/document-arrow-up";
import type { Balance, Expense, Obligation, Settlement } from "@/lib/types";

export interface ImportData {
  autoSyncBalances: boolean;
  autoSyncObligations: boolean;
  autoSyncSettlements: boolean;
  balances: Balance[];
  expenses: Expense[];
  obligations: Obligation[];
  settlements: Settlement[];
  version: 1;
}

interface Props {
  autoSyncBalances: boolean;
  autoSyncObligations: boolean;
  autoSyncSettlements: boolean;
  balances: Balance[];
  expenses: Expense[];
  obligations: Obligation[];
  onImport: (data: ImportData) => void;
  settlements: Settlement[];
}

export default function DataActions(props: Props) {
  let fileInput: HTMLInputElement | undefined;

  function handleExport() {
    const data: ImportData = {
      autoSyncBalances: props.autoSyncBalances,
      autoSyncObligations: props.autoSyncObligations,
      autoSyncSettlements: props.autoSyncSettlements,
      balances: props.balances,
      expenses: props.expenses,
      obligations: props.obligations,
      settlements: props.settlements,
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
    const file = fileInput?.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
          return;
        }
        const data = JSON.parse(text) as ImportData;
        if (data.version !== 1) {
          throw new Error("unsupported file version");
        }
        props.onImport(data);
      } catch (err) {
        console.error(`Import failed: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <div class="flex items-center gap-2">
      <input
        accept=".json"
        class="hidden"
        onChange={handleImport}
        ref={(el) => {
          fileInput = el;
        }}
        type="file"
      />
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-2 font-medium text-slate-400 text-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-700/40 hover:text-slate-300 active:scale-[0.97] active:border-slate-500 active:bg-slate-700/60"
        onClick={() => fileInput?.click()}
        type="button"
      >
        <DocumentArrowDown class="size-5" />
        Import
      </button>
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-4 py-2 font-medium text-slate-400 text-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-700/40 hover:text-slate-300 active:scale-[0.97] active:border-slate-500 active:bg-slate-700/60"
        onClick={handleExport}
        type="button"
      >
        <DocumentArrowUp class="size-5" />
        Export
      </button>
    </div>
  );
}
