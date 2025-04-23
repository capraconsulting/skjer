<script lang="ts">
  import { dateHasPassed } from "$lib/utils/date.util";
  import { Input, Button, Spinner } from "flowbite-svelte";
  import type { Event } from "$models/sanity.model";
  import { _ } from "$lib/i18n";

  export let event: Event;
  export let form;
  export let errors;
  export let delayed;
  export let enhance;
</script>

{#if !dateHasPassed(event.deadline)}
  <form
    class="mt-20 flex flex-col gap-1"
    method="POST"
    action="?/submitUnregistrationExternal"
    use:enhance
  >
    <input type="text" name="subject" id="subject" class="hidden" />

    <h2 id="unregistration" class="pb-4 text-base font-bold sm:text-xl">
      {$_('common.wantToUnregister')}
    </h2>

    <div class="flex flex-wrap gap-3 sm:flex-nowrap">
      <Input
        class=" bg-white"
        type="text"
        placeholder="Skriv inn din e-post her"
        name="email"
        bind:value={$form.email}
      />
      <Button pill color="dark" type="submit" disabled={$delayed} class="w-max whitespace-nowrap">
        <span class="ml-2">{$_('common.unregisterMe')}</span>
        <span class="w-2">
          {#if $delayed}
            <Spinner color="gray" class="ml-2" size="4" />
          {/if}
        </span>
      </Button>
    </div>

    {#if $errors.email}
      <p class="text-xs text-red-600">Fyll inn gyldig e-post.</p>
    {/if}
  </form>
{/if}
