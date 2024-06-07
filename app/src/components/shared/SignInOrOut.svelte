<script>
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { Button } from "flowbite-svelte";

  export let auth;
</script>

{#if auth}
  <div class="flex flex-row items-center gap-2">
    <img class="h-7 rounded-2xl" alt="Profilbilde" src={auth.user.image} />
    <span class="mr-6 hidden text-sm font-normal sm:block">{auth.user.name}</span>
    <Button color="dark" class="h-7" pill on:click={() => signOut({ callbackUrl: "/" })}
      >Logg ut</Button
    >
  </div>
{:else}
  <Button color="dark" class="h-7" pill on:click={() => signIn("google")}>Logg inn</Button>
{/if}
