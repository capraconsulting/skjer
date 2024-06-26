<script lang="ts">
  import { Checkbox, Input } from "flowbite-svelte";
  import { writable } from "svelte/store";

  interface CustomOption {
    value: string;
    option: string;
  }

  interface FormData {
    customOptions: CustomOption[];
  }

  export let form = writable<FormData>({ customOptions: [] });

  export let optionLabel: string;
  export let inputType: string;

  function handleCheckboxChange(event: Event) {
    const { checked } = event.target as HTMLInputElement;
    updateFormValue(optionLabel, checked ? "Ja" : "");
  }

  function handleInputChange(event: Event) {
    const { value } = event.target as HTMLInputElement;
    updateFormValue(optionLabel, value);
  }

  function updateFormValue(option: string, value: string) {
    form.update((currentForm) => {
      const updatedOptions = currentForm.customOptions.filter(
        (customOption) => customOption.option !== option
      );

      if (value) {
        updatedOptions.push({ option, value });
      }

      return { ...currentForm, customOptions: updatedOptions };
    });
  }
</script>

<div class="flex flex-col gap-1">
  <span class="block text-sm font-bold text-gray-900 rtl:text-right dark:text-gray-300">
    {optionLabel}
  </span>
  {#if inputType === "checkbox"}
    <Checkbox name="customOptions" on:change={handleCheckboxChange}>Ja!</Checkbox>
  {:else}
    <Input name="customOptions" on:input={handleInputChange} />
  {/if}
</div>
