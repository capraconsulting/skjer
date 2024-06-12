<script>
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { Button } from "flowbite-svelte";

  export let auth;
  let isSigningOut = false; // Reactive variable for the sign-out button
  let isSigningIn = false; // Reactive variable for the sign-in button
</script>

{#if auth}
  <div class="flex flex-row items-center gap-2">
    <img class="h-7 rounded-2xl" alt="Profilbilde" src={auth.user.image} />
    <span class="mr-6 hidden text-sm font-normal sm:block">{auth.user.name}</span>
    <Button
      color="dark"
      class="h-7"
      pill
      on:click={() => {
        isSigningOut = true;
        signOut({ callbackUrl: "/" });
      }}
      disabled={isSigningOut}>Logg ut</Button
    >
  </div>
{:else}
  <Button
    color="dark"
    class="h-7"
    pill
    on:click={() => {
      isSigningIn = true;
      signIn("google");
    }}
    disabled={isSigningIn}>Logg inn</Button
  >
{/if}
