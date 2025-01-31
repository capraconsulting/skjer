<script>
  import { Button } from "flowbite-svelte";
  import { CalendarIcon, LogOutIcon, PlusIcon } from "svelte-feather-icons";
  import DarkMode from "./DarkMode.svelte";
  import { page } from "$app/stores";

  export let auth;
  export let isSigningOut;
  export let openSanityStudio;
  export let signOutHandler;

  const subscribeLink = `https://www.google.com/calendar/render?cid=webcal://${$page.url.host}/api/subscribe`;
</script>

<div class="hidden flex-row items-center gap-3 md:flex">
  <span class="text-sm font-semibold">{auth.user.name}</span>
  <img class="h-8 rounded-2xl" alt="Profilbilde" src={auth.user.image} />

  <Button color="dark" class="h-9" pill on:click={openSanityStudio}>
    <span class="mr-1.5">Opprett</span>
    <PlusIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>

  <Button
    color="alternative"
    class="h-9 border-[#999]"
    pill
    on:click={signOutHandler}
    disabled={isSigningOut}
  >
    <span class="mr-1.5">Logg ut</span>
    <LogOutIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>
  <Button
    color="alternative"
    class="hidden h-9 rounded-2xl border-[#999] p-2.5"
    target="_blank"
    rel="noopener noreferrer"
    href={subscribeLink}
  >
    <CalendarIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>
  <DarkMode size="sm" btnClass="h-9 border-[#999] rounded-2xl p-2.5" />
</div>
