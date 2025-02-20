<script lang="ts">
  import { Checkbox, Radio, Textarea } from "flowbite-svelte";
  import { writable } from "svelte/store";

  export let key: string;
  export let form = writable<FormData>({ customOptions: [] });
  export let optionLabel: string;
  export let inputType: string;
  export let radioValues = ["Ja", "Nei"];
  export let checkboxValue = "Ja";

  interface CustomOption {
    value: string;
    option: string;
  }

  interface FormData {
    customOptions: CustomOption[];
  }

  const handleRadioChange = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    updateFormValue(optionLabel, value);
  };

  const handleCheckboxChange = (event: Event) => {
    const { checked } = event.target as HTMLInputElement;
    updateFormValue(optionLabel, checked ? checkboxValue : "");
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
      if (value) updatedOptions.push({ option, value });
      return { ...currentForm, customOptions: updatedOptions };
    });
  };

  if (inputType === "radio") {
    updateFormValue(optionLabel, radioValues[0]);
  }
</script>

<div class="flex flex-col gap-1">
  <span class="block text-sm font-bold text-gray-900 dark:text-gray-300 rtl:text-right">
    {optionLabel}
  </span>
  {#if inputType === "checkbox"}
    <Checkbox name="customOptions" on:change={handleCheckboxChange}>{checkboxValue}</Checkbox>
  {:else if inputType === "radio"}
    <div class="flex gap-6 text-sm">
      <div class="flex gap-2">
        <Radio
          inline
          name={`customOption-${key}`}
          group={radioValues[0]}
          value={radioValues[0]}
          on:change={handleRadioChange}
        >
          {radioValues[0]}
        </Radio>
      </div>
      <div class="flex gap-2">
        <Radio
          inline
          name={`customOption-${key}`}
          value={radioValues[1]}
          on:change={handleRadioChange}
        >
          {radioValues[1]}
        </Radio>
      </div>
    </div>
  {:else}
    <Textarea name="customOptions" class="bg-white" on:input={handleInputChange} />
  {/if}
</div>
