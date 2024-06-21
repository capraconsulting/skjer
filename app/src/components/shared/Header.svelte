<script>
  import logoLight from "$lib/assets/logo-light.webp";
  import logoDark from "$lib/assets/logo-dark.webp";
  import logoDarkSm from "$lib/assets/logo-dark-sm.webp";
  import logoLightSm from "$lib/assets/logo-light-sm.webp";
  import SignInOrOut from "$components/shared/SignInOrOut.svelte";
  import { page } from "$app/stores";
  import { DarkMode } from "flowbite-svelte";
  import { isSafariOrIOS } from "$lib/utils/device.util";

  export let auth;
  $: isRoot = $page.url.pathname === "/";

  // Check for Safari and iOS devices due to performance issues with large WebP images.
  $: hasPerformanceIssue = isSafariOrIOS();
</script>

<header class="flex h-[100px] w-full items-center justify-between px-4 pt-2 lg:px-20">
  <a
    class={isRoot
      ? "pointer-events-none flex items-center"
      : "pointer-events-auto flex items-center"}
    href="/"
  >
    <img
      fetchpriority="high"
      class="absolute h-12 select-none opacity-100 sm:h-14 dark:opacity-5"
      alt="Animert Capra, Fryde og Liflig-logo"
      src={hasPerformanceIssue ? logoDarkSm : logoDark}
    />
    <img
      fetchpriority="high"
      class="absolute h-12 select-none opacity-5 sm:h-14 dark:opacity-100"
      alt="Animert Capra, Fryde og Liflig-logo"
      src={hasPerformanceIssue ? logoLightSm : logoLight}
    />
  </a>

  <div class="flex flex-row items-center justify-end gap-2">
    <SignInOrOut {auth} />
    <DarkMode />
  </div>
</header>
