<script lang="ts">
  import { personColor } from "$lib/utils";

  let { name }: { name: string } = $props();
</script>

<span
  class="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
  style="background:{personColor(name)}"
>
  {name[0]?.toUpperCase()}
</span>
