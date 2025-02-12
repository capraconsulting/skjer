<script lang="ts">
  import { Label, Textarea } from "flowbite-svelte";

  export let form;
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="foodPreference">Matpreferanser og allergier</Label>
  <Textarea
    size="sm"
    class="bg-white"
    type="text"
    name="foodPreference"
    id="foodPreference"
    placeholder="Skriv dine matpreferanser og allergier"
    bind:value={$form.foodPreference}
  />
</div>
