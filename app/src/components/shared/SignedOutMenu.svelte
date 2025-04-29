<script>
  import { Button } from "flowbite-svelte";
  import { LogInIcon } from "svelte-feather-icons";
  import DarkMode from "./DarkMode.svelte";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import { _ } from "$lib/i18n";

  export let signInHandler;
  export let isSigningIn;
</script>

<div class="flex items-center gap-3">
  <LanguageSwitcher />
  <Button
    color="alternative"
    class="h-9 border-[#999] w-[125px] justify-center"
    pill
    on:click={signInHandler}
    disabled={isSigningIn}
  >
    <span class="mr-1.5">{$_('common.login')}</span>
    <LogInIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>
  <DarkMode size="sm" btnClass="h-9 border-[#999] rounded-2xl p-2.5" />
</div>
