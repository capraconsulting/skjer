<script>
  import { Label, Radio } from "flowbite-svelte";
  export let registrationForm;
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="attendingType">Hvordan vil du delta?</Label>
  <div class="flex gap-6 text-sm">
    <div class="flex gap-2">
      <Radio
        name="attendingType"
        inline
        value="Fysisk"
        bind:group={$registrationForm.attendingType}
      /> Fysisk
    </div>
    <div class="flex gap-2">
      <Radio
        name="attendingType"
        inline
        value="Digitalt"
        bind:group={$registrationForm.attendingType}
      /> Digitalt
    </div>
  </div>
</div>
