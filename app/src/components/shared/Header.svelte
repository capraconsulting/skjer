<script>
  import logoLight from "$lib/assets/logo-light.webp";
  import logoDark from "$lib/assets/logo-dark.webp";
  import logoDarkSm from "$lib/assets/logo-dark-sm.webp";
  import logoLightSm from "$lib/assets/logo-light-sm.webp";
  import logoReducedMotion from "$lib/assets/logo-reduced-motion.webp";
  import { page } from "$app/stores";
  import { isSafariOrIOS } from "$lib/utils/device.util";
  import HeaderActions from "$components/shared/HeaderActions.svelte";
  import { _ } from "$lib/i18n";

  export let auth;
  $: isRoot = $page.url.pathname === "/";

  // Check for Safari and iOS devices due to performance issues with large WebP images.
  $: hasPerformanceIssue = isSafariOrIOS();
</script>

<header class="flex h-[100px] w-full items-center justify-between px-4 pt-2 lg:px-20">
  <a class={`flex items-center ${isRoot ? "pointer-events-none" : "pointer-events-auto"}`} href="/">
    <img
      fetchpriority="high"
      class="absolute h-12 select-none opacity-100 motion-reduce:hidden sm:h-14 dark:opacity-5"
      alt={$_('common.animatedLogo')}
      src={hasPerformanceIssue ? logoDarkSm : logoDark}
    />
    <img
      fetchpriority="high"
      class="absolute h-12 select-none opacity-5 motion-reduce:hidden sm:h-14 dark:opacity-100"
      alt={$_('common.animatedLogo')}
      src={hasPerformanceIssue ? logoLightSm : logoLight}
    />
    <img
      class="absolute hidden h-8 select-none opacity-100 motion-reduce:flex sm:h-10 dark:opacity-100"
      alt={$_('common.logo')}
      src={logoReducedMotion}
    />
  </a>

  <div class="flex flex-row items-center justify-end gap-2">
    <HeaderActions {auth} />
  </div>
</header>
