<script>
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { Button } from "flowbite-svelte";

  export let auth;
</script>

{#if auth}
  <div class="flex flex-row gap-2 items-center">
    <img class="h-7 rounded-xl" alt="Profilbilde" src={auth.user.image} />
    <span class="sm:block hidden text-sm text-black font-normal mr-6">{auth.user.name}</span>
    <Button color="dark" size="xs" pill class="" on:click={() => signOut({ callbackUrl: "/" })}
      >Logg ut</Button
    >
  </div>
{:else}
  <Button color="dark" size="xs" pill class="" on:click={() => signIn("google")}>Logg inn</Button>
{/if}
