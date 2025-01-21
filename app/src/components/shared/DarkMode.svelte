<!--
@component
[Go to docs](https://flowbite-svelte.com/)
-->

<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { Button } from "flowbite-svelte";
  import { MoonIcon, SunIcon } from "svelte-feather-icons";

  interface $$Props extends HTMLButtonAttributes {
    btnClass?: string;
    size?: "sm" | "md" | "lg";
    ariaLabel?: string;
    value?: string;
  }

  export let btnClass: $$Props["btnClass"] = "";
  export let size: NonNullable<$$Props["size"]> = "md";
  export let ariaLabel: $$Props["ariaLabel"] = "Dark mode";
  export let value: $$Props["value"] = "";

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const toggleTheme = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement;
    const isDark = target.ownerDocument.documentElement.classList.toggle("dark");
    if (target.ownerDocument === document)
      // we are NOT in the iFrame
      localStorage.setItem("color-theme", isDark ? "dark" : "light");
  };
</script>

<svelte:head>
  <script>
    if ("color-theme" in localStorage) {
      // explicit preference - overrides author's choice
      localStorage.getItem("color-theme") === "dark"
        ? window.document.documentElement.classList.add("dark")
        : window.document.documentElement.classList.remove("dark");
    } else {
      // browser preference - does not overrides
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        window.document.documentElement.classList.add("dark");
    }
  </script>
</svelte:head>

<Button
  on:click={toggleTheme}
  aria-label={ariaLabel}
  role="button"
  {...$$restProps}
  class={twMerge(btnClass, $$props.class)}
  color="alternative"
>
  {#if value}
    <span class="mr-1.5">{value}</span>
  {/if}
  <span class="hidden dark:block">
    <SunIcon class={sizes[size]} strokeWidth={1.5} />
  </span>
  <span class="block dark:hidden">
    <MoonIcon class={sizes[size]} strokeWidth={1.5} />
  </span>
</Button>
