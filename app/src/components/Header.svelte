<script>
  import capraLogo from "$lib/assets/capra-logo-row.png";
  import frydeLogo from "$lib/assets/fryde-logo-row.png";
  import lifligLogo from "$lib/assets/liflig-logo-row.png";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { Button } from "flowbite-svelte";
  import SignInOrOut from "./SignInOrOut.svelte";

  export let auth;
</script>

<header class="w-full h-[100px] bg-black flex pt-2 text-white items-center justify-between px-20">
  <a class="p-2 sm:px-0 text-4xl font-semibold flex gap-8 items-center justify-center" href="/">
    <img class="h-8" alt="Capra-logo" src={capraLogo} />
    <img class="h-8" alt="Liflig-logo" src={lifligLogo} />
    <img class="h-8" alt="Fryde-logo" src={frydeLogo} />
  </a>
  <div class="flex items-center justify-end">
    <SignInOrOut {auth} />
  </div>
</header>
