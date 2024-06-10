<script lang="ts">
  import { AllergyItems } from "$models/allergy.model";
  import { Label, MultiSelect } from "flowbite-svelte";

  export let form;
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="allergies">Allergier</Label>
  <MultiSelect
    class="bg-transparent"
    items={AllergyItems}
    bind:value={$form.allergies}
    id="allergies"
    name="allergies"
    size="sm"
  />
</div>
