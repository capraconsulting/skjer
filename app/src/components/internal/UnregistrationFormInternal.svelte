<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { Alert, Button } from "flowbite-svelte";
</script>

<form class="flex flex-col gap-4" method="POST" action="?/submitUnregistrationInternal" use:enhance>
  <div class="flex w-full">
    <Button pill color="dark" type="submit">
      <span class="ml-3">Meld meg av</span>
      <span class="w-3"></span>
    </Button>
  </div>
</form>
