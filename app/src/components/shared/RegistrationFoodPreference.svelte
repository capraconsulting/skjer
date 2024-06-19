<script lang="ts">
  import { Label, Input } from "flowbite-svelte";

  export let form;
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="foodPreference">Matpreferanser</Label>

  <Input
    size="sm"
    class="bg-white"
    type="text"
    name="foodPreference"
    id="foodPreference"
    bind:value={$form.foodPreference}
  />
</div>
