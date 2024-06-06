<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { Alert, Button } from "flowbite-svelte";
</script>

<form
  class="mt-20 flex flex-col gap-6"
  method="POST"
  action="?/submitUnregistrationInternal"
  use:enhance
>
  <div class="mb-8 flex flex-col items-start justify-center">
    <div class="flex flex-col items-start gap-4">
      <h4
        class="text-2xl font-bold leading-none tracking-tight text-gray-900 sm:text-2xl dark:text-white"
      >
        <p class="text-2xl">Ønsker du å melde deg av?</p>
      </h4>

      <Button class="mt-4" pill color="dark" type="submit">
        <span class="ml-3">Meld meg av</span>
        <span class="w-3"></span>
        <!-- Used for spinner -->
      </Button>
    </div>
  </div>
</form>

{#if $page.form?.message}
  <Alert class="mb-6" color={$page.form.success ? "green" : $page.form.warning ? "yellow" : "red"}>
    {$page.form.message}
  </Alert>
{/if}
