<script lang="ts">
  import { PUBLIC_SANITY_STUDIO_URL } from "$env/static/public";
  import { signIn, signOut } from "@auth/sveltekit/client";

  export let auth;
  let isSigningOut = false;
  let isSigningIn = false;

  const openSanityStudio = () => {
    window.open(PUBLIC_SANITY_STUDIO_URL, "_blank");
  };

  const signOutHandler = async () => {
    isSigningOut = true;
    await signOut({ callbackUrl: "/" });
  };

  const signInHandler = async () => {
    isSigningIn = true;
    await signIn("google");
  };
</script>

{#if auth}
  <div
    data-testid="signed-in-desktop-menu"
    data-props={JSON.stringify({ auth, isSigningOut })}
    data-has-open-sanity-studio="true"
    data-has-sign-out-handler="true"
  ></div>
  <div
    data-testid="signed-in-mobile-menu"
    data-props={JSON.stringify({ auth, isSigningOut })}
    data-has-open-sanity-studio="true"
    data-has-sign-out-handler="true"
  ></div>
{:else}
  <div
    data-testid="signed-out-menu"
    data-props={JSON.stringify({ isSigningIn })}
    data-has-sign-in-handler="true"
  ></div>
{/if}
