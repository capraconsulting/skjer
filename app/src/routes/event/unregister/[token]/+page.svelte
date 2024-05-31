<script lang="ts">
  import { Alert } from "flowbite-svelte";

  export let data;
</script>

<section class="w-full mt-2 mb-80 mx-0">
  {#if data?.success}
    <Alert color="green" class="mb-6">Du har avregistrert deg fra arrangementet!</Alert>
  {:else}
    <Alert color="red" class="mb-6">Vi kunne ikke avregistrere deg, prøv på nytt senere!</Alert>
  {/if}
</section>
