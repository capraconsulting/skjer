<script>
  import { PUBLIC_SANITY_STUDIO_URL } from "$env/static/public";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import SignedOutMenu from "./SignedOutMenu.svelte";
  import SignedInDesktopMenu from "./SignedInDesktopMenu.svelte";
  import SignedInMobileMenu from "./SignedInMobileMenu.svelte";

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
  <SignedInDesktopMenu {auth} {isSigningOut} {openSanityStudio} {signOutHandler} />
  <SignedInMobileMenu {auth} {isSigningOut} {openSanityStudio} {signOutHandler} />
{:else}
  <SignedOutMenu {isSigningIn} {signInHandler} />
{/if}
