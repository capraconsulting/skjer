<script>
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { Button } from "flowbite-svelte";

  export let auth;
</script>

{#if auth}
  <div class="flex gap-2 items-center">
    <img class="h-7 border-2 border-slate-700 rounded-xl" alt="Profilbilde" src={auth.user.image} />
    <span class="text-sm font-semibold mr-7">{auth.user.name}</span>
  </div>
  <Button color="dark" pill class="" on:click={() => signOut({ callbackUrl: "/" })}>Logg ut</Button>
{:else}
  <Button color="dark" pill class="" on:click={() => signIn("google")}>Logg inn</Button>
{/if}
