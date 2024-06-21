<script lang="ts">
  import { Checkbox, Input } from "flowbite-svelte";

  export let form;
  export let option: string;
  export let label: string;
  export let type: string;
</script>

<div class="flex flex-col gap-1">
  <span class="block text-sm font-bold text-gray-900 rtl:text-right dark:text-gray-300"
    >{label}</span
  >
  {#if type === "checkbox"}
    <Checkbox value={option} name="customOptions" bind:group={$form.customOptions}>Ja</Checkbox>
  {:else}
    <Input name="customOptions" bind:group={$form.customOptions} />
  {/if}
</div>
