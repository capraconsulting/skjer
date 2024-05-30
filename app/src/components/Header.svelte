<script>
  import capraLogo from "$lib/assets/capra-logo-row.png";
  import frydeLogo from "$lib/assets/fryde-logo-row.png";
  import lifligLogo from "$lib/assets/liflig-logo-row.png";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { Button } from "flowbite-svelte";

  export let auth;
</script>

<header class="w-full h-[100px] bg-black flex pt-2 text-white items-center justify-between px-20">
  <a class="p-2 sm:px-0 text-4xl font-semibold flex gap-8 items-center justify-center" href="/">
    <img class="h-8" alt="Capra-logo" src={capraLogo} />
    <img class="h-8" alt="Liflig-logo" src={lifligLogo} />
    <img class="h-8" alt="Fryde-logo" src={frydeLogo} />
  </a>
  <div class="flex items-center justify-end">
    {#if auth}
      <div class="flex gap-2 items-center">
        <img
          class="h-7 border-2 border-slate-700 rounded-xl"
          alt="Profilbilde"
          src={auth.user.image}
        />
        <span class="text-sm font-semibold mr-7">{auth.user.name}</span>
      </div>
      <Button color="dark" pill class="" on:click={() => signOut({ callbackUrl: "/" })}
        >Logg ut</Button
      >
    {:else}
      <Button color="dark" pill class="" on:click={() => signIn("google")}>Logg inn</Button>
    {/if}
  </div>
</header>
