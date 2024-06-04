<script>
  import logo from "$lib/assets/logo.webp";
  import SignInOrOut from "./SignInOrOut.svelte";

  export let auth;
</script>

<header class="flex h-[100px] w-full items-center justify-between px-4 pt-2 text-white lg:px-20">
  <a class="flex items-center justify-center gap-6 p-2 text-4xl font-semibold sm:px-0" href="/">
    <img class="h-12 sm:h-14" alt="Animert Capra, Fryde og Liflig-logo" src={logo} />
  </a>
  <div class="flex items-center justify-end">
    <SignInOrOut {auth} />
  </div>
</header>
