<script lang="ts">
  import { Label, Input } from "flowbite-svelte";

  export let form;
</script>

<div class="flex flex-col gap-1">
  <Label class="font-bold" for="facilitation">Trenger du tilrettelegging?</Label>
  <Input
    size="sm"
    class="bg-white"
    type="text"
    name="facilitation"
    id="facilitation"
    bind:value={$form.facilitation}
  />
</div>
