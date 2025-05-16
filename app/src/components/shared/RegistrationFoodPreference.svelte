<script lang="ts">
  import { Label, Textarea } from "flowbite-svelte";
  import { _ } from "$lib/i18n";

  export let form;
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="foodPreference">{$_('registration.foodPreferences')}</Label>
  <Textarea
    size="sm"
    class="bg-white"
    type="text"
    name="foodPreference"
    id="foodPreference"
    placeholder={$_('registration.enterFoodPreferences')}
    bind:value={$form.foodPreference}
  />
</div>
