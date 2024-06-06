<script>
  import logo from "$lib/assets/logo.webp";
  import logoSm from "$lib/assets/logo-sm.webp";
  import SignInOrOut from "$components/shared/SignInOrOut.svelte";
  import { page } from "$app/stores";

  export let auth;
  $: isRoot = $page.url.pathname === "/";

  // Check for Safari and iOS devices due to performance issues with large WebP images.
  $: isSafariOrIOS = isSafari() || isIOS();

  function isSafari() {
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.includes("Chrome") || userAgent.includes("Chromium");
    return userAgent.includes("Safari") && !isChrome;
  }

  function isIOS() {
    const userAgent = navigator.userAgent;
    return /iPad|iPhone/.test(userAgent);
  }
</script>

<header class="flex h-[100px] w-full items-center justify-between px-4 pt-2 lg:px-20">
  <a class={isRoot ? "pointer-events-none" : "pointer-events-auto"} href="/">
    <img
      class="h-12 select-none sm:h-14"
      alt="Animert Capra, Fryde og Liflig-logo"
      src={isSafariOrIOS ? logoSm : logo}
    />
  </a>
  <div class="flex items-center justify-end">
    <SignInOrOut {auth} />
  </div>
</header>
