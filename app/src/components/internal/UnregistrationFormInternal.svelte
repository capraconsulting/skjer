<script lang="ts">
  import { Button, Spinner } from "flowbite-svelte";

  export let enhance;
  export let delayed;
  export let isAttending;
</script>

{#if isAttending}
  <h2 class="pb-4 text-base font-bold sm:text-xl">Avmelding:</h2>
  <form
    class="flex flex-col gap-4"
    method="POST"
    action="?/submitUnregistrationInternal"
    use:enhance
  >
    <div class="flex w-full">
      <Button pill color="alternative" type="submit" disabled={$delayed}>
        <span class="ml-3">Meld meg av</span>
        <span class="w-3">
          {#if $delayed}
            <Spinner class="ml-2 text-black dark:text-white" size="4" />
          {/if}
        </span>
      </Button>
    </div>
  </form>
{/if}
