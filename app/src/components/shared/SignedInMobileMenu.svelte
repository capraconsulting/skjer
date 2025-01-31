<script>
  import { Button } from "flowbite-svelte";
  import { CalendarIcon, LogOutIcon, PlusIcon } from "svelte-feather-icons";
  import DarkMode from "./DarkMode.svelte";
  import { page } from "$app/stores";

  export let auth;
  export let openSanityStudio;
  export let isSigningOut;
  export let signOutHandler;

  const subscribeLink = `https://www.google.com/calendar/render?cid=webcal://${$page.url.host}/api/subscribe`;
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };
</script>

<div class="flex items-center gap-3 md:hidden">
  <Button color="alternative" class="border-[#CCC] px-2 py-1 text-black" pill on:click={toggleMenu}>
    <span class="mr-1.5 max-w-[150px] truncate text-sm font-semibold" title={auth.user.name}
      >{auth.user.name}</span
    >
    <img class="h-8 rounded-2xl" alt="Profilbilde" src={auth.user.image} />
  </Button>

  {#if isMenuOpen}
    <div
      class="absolute right-4 top-20 flex w-40 flex-col items-center gap-3 rounded-md border bg-white p-4 shadow-lg dark:border-[#4B5563] dark:bg-black"
    >
      <Button color="dark" class="w-32 px-4 py-2 text-left" pill on:click={openSanityStudio}>
        <span class="mr-1.5">Opprett</span>
        <PlusIcon strokeWidth={1.5} class="w-[16px]" />
      </Button>

      <Button
        color="alternative"
        class="h-9 w-32 border-[#999]"
        pill
        on:click={signOutHandler}
        disabled={isSigningOut}
      >
        <span class="mr-1.5">Logg ut</span>
        <LogOutIcon strokeWidth={1.5} class="w-[16px]" />
      </Button>
      <Button
        color="alternative"
        class="h-9 w-32 border-[#999]"
        pill
        target="_blank"
        rel="noopener noreferrer"
        href={subscribeLink}
      >
        <span class="mr-1.5">Subscribe</span>
        <CalendarIcon strokeWidth={1.5} class="w-[16px]" />
      </Button>
      <DarkMode size="sm" value="Modus" btnClass="h-9 border-[#999] w-32 rounded-2xl" />
    </div>
  {/if}
</div>
