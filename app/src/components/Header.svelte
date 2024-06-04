<script>
  import logo from "$lib/assets/logo.webp";
  import SignInOrOut from "./SignInOrOut.svelte";
  import { page } from "$app/stores";

  export let auth;
  $: isRoot = $page.url.pathname === "/";
</script>

<header class="flex h-[100px] w-full items-center justify-between px-4 pt-2 lg:px-20">
  <a class={isRoot ? "pointer-events-none" : "pointer-events-auto"} href="/">
    <img class="h-12 select-none sm:h-14" alt="Animert Capra, Fryde og Liflig-logo" src={logo} />
  </a>
  <div class="flex items-center justify-end">
    <SignInOrOut {auth} />
  </div>
</header>
