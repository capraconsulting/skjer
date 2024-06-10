<script lang="ts">
  import { Checkbox } from "flowbite-svelte";

  export let form;
  export let option;
  export let label;
</script>

<div class="flex flex-col gap-1">
  <span class="block text-sm font-bold text-gray-900 rtl:text-right dark:text-gray-300"
    >{label}</span
  >
  <Checkbox value={option} name="customOptions" bind:group={$form.customOptions}>Ja</Checkbox>
</div>
