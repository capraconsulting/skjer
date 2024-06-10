<script lang="ts">
  import { Input, Button, ButtonGroup, Alert } from "flowbite-svelte";

  export let form;
  export let errors;
  export let enhance;
  export let message;
</script>

<form class="mt-20 flex flex-col gap-6" method="POST" action="?/submitUnregistration" use:enhance>
  <div
    class="mb-8 flex flex-col items-start justify-center gap-4 rounded-lg border p-4 sm:p-8 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="flex flex-col items-center gap-5">
      <div class="flex flex-col items-start gap-4">
        <h4
          class="text-2xl font-bold leading-none tracking-tight text-gray-900 sm:text-2xl dark:text-white"
        >
          <p class="text-2xl">Ønsker du å melde deg av?</p>
        </h4>

        <ButtonGroup class="w-100">
          <Input
            class="bg-white"
            type="text"
            placeholder="din-epost@epost.no"
            name="email"
            bind:value={$form.email}
          />
          <Button class="w-48" type="submit" color="dark">Meld meg av</Button>
        </ButtonGroup>
        {#if $errors.email}
          <p class="text-xs text-red-600">Fyll inn gyldig epost.</p>
        {/if}
      </div>
    </div>
  </div>
</form>

{#if $message?.text}
  <Alert class="mb-6" color={$message.success ? "green" : $message.warning ? "yellow" : "red"}>
    {$message.text}
    <!-- demo purpose -->
    {#if $message.token}
      <div class="w-[400px] break-words border border-gray-300 p-2 text-xs">
        Kun for demo, ingen sensitiv informasjon:
        {`/event/unregistration/${$message.token}`}
      </div>
    {/if}
  </Alert>
{/if}
