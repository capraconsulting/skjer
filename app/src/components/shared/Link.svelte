<script lang="ts">
  import type { MarkComponentProps } from "@portabletext/svelte";

  export let portableText: MarkComponentProps;

  $: ({ value } = portableText);
  $: href = value?.href || value?.url || value?.link || value?.value;
</script>

{#if typeof href === "string"}
  <a {href} target="_blank" rel="noopener noreferrer"><slot /></a>
{:else}
  <slot />
{/if}
