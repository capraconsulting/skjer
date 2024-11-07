<script lang="ts">
  import { Label, Textarea } from "flowbite-svelte";

  export let form;
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="foodPreference">Allergier og matpreferanser</Label>
  <Textarea
    size="sm"
    class="bg-white"
    type="text"
    name="foodPreference"
    id="foodPreference"
    placeholder="Skriv dine allergier og preferanser"
    bind:value={$form.foodPreference}
  />
</div>
