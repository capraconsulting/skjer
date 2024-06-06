<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { MoonStars, SunDim } from "phosphor-svelte";
  import { browser } from "$app/environment";

  let darkMode = true;

  function handleSwitchDarkMode() {
    darkMode = !darkMode;

    localStorage.setItem("theme", darkMode ? "dark" : "light");

    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }

  if (browser) {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      darkMode = true;
    } else {
      document.documentElement.classList.remove("dark");
      darkMode = false;
    }
  }
</script>

<div>
  <Button
    size="xs"
    class="ml-2 hover:bg-slate-100 hover:dark:bg-slate-800"
    pill
    on:click={handleSwitchDarkMode}
  >
    {#if darkMode}
      <SunDim size="25" />
    {:else}
      <MoonStars size="25" class="text-black" />
    {/if}
  </Button>
</div>
