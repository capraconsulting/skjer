<script lang="ts">
  import { Label, Radio } from "flowbite-svelte";
  import { _, locale } from "$lib/i18n";

  export let form;

  // Update form value when locale changes to ensure consistency
  $: if ($locale) {
    if ($form.attendingType === "Fysisk" || $form.attendingType === "Physical") {
      $form.attendingType = $_('registration.physical');
    } else if ($form.attendingType === "Digitalt" || $form.attendingType === "Digital") {
      $form.attendingType = $_('registration.digital');
    }
  }
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="attendingType">{$_('registration.howToParticipate')}</Label>
  <div class="flex gap-6 text-sm">
    <div class="flex gap-2">
      <Radio name="attendingType" inline value={$_('registration.physical')} bind:group={$form.attendingType} /> {$_('registration.physical')}
    </div>
    <div class="flex gap-2">
      <Radio name="attendingType" inline value={$_('registration.digital')} bind:group={$form.attendingType} /> {$_('registration.digital')}
    </div>
  </div>
</div>
