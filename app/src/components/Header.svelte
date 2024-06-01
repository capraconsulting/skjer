<script>
  import logo from "$lib/assets/logo.webp";
  import SignInOrOut from "./SignInOrOut.svelte";

  export let auth;
</script>

<header
  class="w-full h-[100px] shadow-md bg-black flex pt-2 text-white items-center justify-between px-20"
>
  <a class="p-2 sm:px-0 text-4xl font-semibold flex gap-1 items-center justify-center" href="/">
    <img class="h-[80px]" alt="Animert Capra, Fryde og Liflig logo" src={logo} />
    <span class="text-base">Arrangementer</span>
  </a>
  <div class="flex items-center justify-end">
    <SignInOrOut {auth} />
  </div>
</header>
