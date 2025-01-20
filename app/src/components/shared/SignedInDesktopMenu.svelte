<script>
  import { Button } from "flowbite-svelte";
  import { LogOutIcon, PlusIcon } from "svelte-feather-icons";
  import DarkMode from "./DarkMode.svelte";

  export let auth;
  export let isSigningOut;
  export let openSanityStudio;
  export let signOutHandler;
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
  <DarkMode size="sm" btnClass="h-9 border-[#999] rounded-2xl p-2.5" />
</div>
