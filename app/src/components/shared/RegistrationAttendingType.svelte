<script lang="ts">
  import { Label, Radio } from "flowbite-svelte";
  import { _ } from "$lib/i18n";

  export let form;

  // Use Norwegian values for the form since they are stored in Norwegian
  // Initialize with a default value if not set and handle backward compatibility
  $: if (!$form.attendingType) {
    $form.attendingType = "Fysisk";
  } else if ($form.attendingType === "physical" || $form.attendingType === "Physical") {
    $form.attendingType = "Fysisk";
  } else if ($form.attendingType === "digital" || $form.attendingType === "Digital") {
    $form.attendingType = "Digitalt";
  }

</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="attendingType">{$_('registration.howToParticipate')}</Label>
  <div class="flex gap-6 text-sm">
    <div class="flex gap-2">
      <Radio name="attendingType" inline value={"Fysisk"} bind:group={$form.attendingType} /> {$_('registration.physical')}
    </div>
    <div class="flex gap-2">
      <Radio name="attendingType" inline value={"Digitalt"} bind:group={$form.attendingType} /> {$_('registration.digital')}
    </div>
  </div>
</div>
