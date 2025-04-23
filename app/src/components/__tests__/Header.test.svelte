<script lang="ts">
  import { page } from "$app/stores";
  import { isSafariOrIOS } from "$lib/utils/device.util";

  export let auth;
  export let isRoot = $page.url.pathname === "/";
  $: hasPerformanceIssue = isSafariOrIOS();

  // Mock image paths
  const logoDark = "logo-dark-mock-path";
  const logoLight = "logo-light-mock-path";
  const logoDarkSm = "logo-dark-sm-mock-path";
  const logoLightSm = "logo-light-sm-mock-path";
  const logoReducedMotion = "logo-reduced-motion-mock-path";
</script>

<header class="flex h-[100px] w-full items-center justify-between px-4 pt-2 lg:px-20">
  <a class={`flex items-center ${isRoot ? "pointer-events-none" : "pointer-events-auto"}`} href="/">
    <img
      fetchpriority="high"
      class="absolute h-12 select-none opacity-100 motion-reduce:hidden sm:h-14 dark:opacity-5"
      alt="Animert Capra, Fryde og Liflig-logo"
      src={hasPerformanceIssue ? logoDarkSm : logoDark}
    />
    <img
      fetchpriority="high"
      class="absolute h-12 select-none opacity-5 motion-reduce:hidden sm:h-14 dark:opacity-100"
      alt="Animert Capra, Fryde og Liflig-logo"
      src={hasPerformanceIssue ? logoLightSm : logoLight}
    />
    <img
      class="absolute hidden h-8 select-none opacity-100 motion-reduce:flex sm:h-10 dark:opacity-100"
      alt="Capra, Fryde og Liflig-logo"
      src={logoReducedMotion}
    />
  </a>

  <div class="flex flex-row items-center justify-end gap-2">
    <div data-testid="header-actions" data-props={JSON.stringify({ auth })}></div>
  </div>
</header>
