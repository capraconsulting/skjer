<script lang="ts">
  import { Alert } from "flowbite-svelte";

  export let data;
</script>

<svelte:head>
  <title>Avmelding | Capra Liflig Fryde</title>
</svelte:head>

<section class="mx-0 mb-80 mt-2 w-full">
  {#if data?.success}
    <Alert color="green" class="mb-6">Du har avmeldt deg fra arrangementet!</Alert>
  {:else}
    <Alert color="red" class="mb-6">Vi kunne ikke avmelde deg, prøv på nytt senere!</Alert>
  {/if}
</section>
