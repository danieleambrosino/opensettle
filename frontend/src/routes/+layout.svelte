<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon}>
  <title>OpenSettle — Cash Flow Minimizer</title>
  <meta
    name="description"
    content="Split group expenses, balance debts, and find the minimal settlement set."
  >
</svelte:head>
{@render children()}
