<script lang="ts">
  import { Checkbox, Textarea } from "flowbite-svelte";
  import { writable } from "svelte/store";

  export let form = writable<FormData>({ customOptions: [] });
  export let optionLabel: string;
  export let inputType: string;

  interface CustomOption {
    value: string;
    option: string;
  }

  interface FormData {
    customOptions: CustomOption[];
  }

  const handleCheckboxChange = (event: Event) => {
    const { checked } = event.target as HTMLInputElement;
    updateFormValue(optionLabel, checked ? "Ja" : "");
  };

  const handleInputChange = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    updateFormValue(optionLabel, value);
  };

  const updateFormValue = (option: string, value: string) => {
    form.update((currentForm) => {
      const updatedOptions = currentForm.customOptions.filter(
        (customOption) => customOption.option !== option
      );

      if (value) {
        updatedOptions.push({ option, value });
      }

      return { ...currentForm, customOptions: updatedOptions };
    });
  };
</script>

<div class="flex flex-col gap-1">
  <span class="block text-sm font-bold text-gray-900 rtl:text-right dark:text-gray-300">
    {optionLabel}
  </span>
  {#if inputType === "checkbox"}
    <Checkbox name="customOptions" on:change={handleCheckboxChange}>Ja!</Checkbox>
  {:else}
    <Textarea name="customOptions" class="bg-white" on:input={handleInputChange} />
  {/if}
</div>
