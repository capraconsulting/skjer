<script>
  import logo from "$lib/assets/logo.webp";
  import logoDark from "$lib/assets/logo-dark.webp";
  import logoSm from "$lib/assets/logo-sm.webp";
  import logoSmDark from "$lib/assets/logo-dark-sm.webp";
  import SignInOrOut from "$components/shared/SignInOrOut.svelte";
  import { page } from "$app/stores";
  import { DarkMode } from "flowbite-svelte";

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
      class="block h-12 select-none sm:h-14 dark:hidden"
      alt="Animert Capra, Fryde og Liflig-logo"
      src={isSafariOrIOS ? logoSm : logo}
    />
    <img
      class="hidden h-12 select-none sm:h-14 dark:block"
      alt="Animert Capra, Fryde og Liflig-logo"
      src={isSafariOrIOS ? logoSmDark : logoDark}
    />
  </a>
  <div class="flex flex-row items-center justify-end gap-2">
    <SignInOrOut {auth} />
    <DarkMode />
  </div>
</header>
