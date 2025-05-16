<script>
  import { Button } from "flowbite-svelte";
  import { CalendarIcon, LogOutIcon, PlusIcon } from "svelte-feather-icons";
  import DarkMode from "./DarkMode.svelte";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import { page } from "$app/stores";
  import { _ } from "$lib/i18n";

  export let auth;
  export let isSigningOut;
  export let openSanityStudio;
  export let signOutHandler;

  const subscribeLink = `https://www.google.com/calendar/render?cid=webcal://${$page.url.host}/api/subscribe`;
</script>

<div class="hidden flex-row items-center gap-3 md:flex">
  <span class="text-sm font-semibold">{auth.user.name}</span>
  <img class="h-8 rounded-2xl" alt={$_('common.profilePicture')} src={auth.user.image} />

  <Button color="alternative" class="h-9 w-[110px]" pill on:click={openSanityStudio}>
    <span class="mr-1.5">{$_('common.create')}</span>
    <PlusIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>
  <Button
    color="alternative"
    class="h-9 rounded-2xl border-[#999] p-2.5 w-[125px]"
    target="_blank"
    rel="noopener noreferrer"
    href={subscribeLink}
    alt={$_('common.subscribeToCalendar')}
  >
    <span class="mr-1.5">{$_('common.subscribe')}</span>
    <CalendarIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>
  <LanguageSwitcher />
  <Button
    color="alternative"
    class="h-9 border-[#999] w-[125px] justify-center"
    pill
    on:click={signOutHandler}
    disabled={isSigningOut}
  >
    <span class="mr-1.5">{$_('common.logout')}</span>
    <LogOutIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>
  <DarkMode size="sm" btnClass="h-9 border-[#999] rounded-2xl p-2.5" />
</div>
