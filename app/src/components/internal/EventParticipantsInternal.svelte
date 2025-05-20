<script>
  import { Badge } from "flowbite-svelte";
  import { _ } from "$lib/i18n";

  export let names;
</script>

{#if names?.length}
  {#each names as name}
    <span>
      <Badge rounded class="mb-1 mr-1 h-6 border border-black bg-transparent dark:bg-zinc-800"
        >{name}</Badge
      >
    </span>
  {/each}
{:else}
  <p>{$_('common.noColleaguesRegistered')}</p>
{/if}
