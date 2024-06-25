<script lang="ts">
  import { Checkbox, Input } from "flowbite-svelte";
  import { writable } from "svelte/store";

  export let form = writable<{
    customOptions: {
      value: string;
      option: string;
    }[];
  }>();
  export let option: string;
  export let type: string;

  function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      handleValueChange(option, target.checked ? "Ja" : "");
    }
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      handleValueChange(option, target.value);
    }
  }

  function handleValueChange(option: string, value: string) {
    form.update((currentForm) => {
      const updatedOptions = currentForm.customOptions.filter(
        (customOption) => customOption.value && customOption.option !== option
      );

      if (value) {
        updatedOptions.push({ option, value });
      }

      currentForm.customOptions = updatedOptions;
      return currentForm;
    });
  }
</script>

<div class="flex flex-col gap-1">
  <span class="block text-sm font-bold text-gray-900 rtl:text-right dark:text-gray-300"
    >{option}</span
  >
  {#if type === "checkbox"}
    <Checkbox name="customOptions" on:change={handleCheckboxChange}>Ja!</Checkbox>
  {:else}
    <Input name="customOptions" on:input={handleInputChange} />
  {/if}
</div>
