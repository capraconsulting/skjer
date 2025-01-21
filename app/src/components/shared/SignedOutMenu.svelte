<script>
  import { Button } from "flowbite-svelte";
  import { LogInIcon } from "svelte-feather-icons";
  import DarkMode from "./DarkMode.svelte";

  export let signInHandler;
  export let isSigningIn;
</script>

<div class="flex items-center gap-3">
  <Button
    color="alternative"
    class="h-9 border-[#999]"
    pill
    on:click={signInHandler}
    disabled={isSigningIn}
  >
    <span class="mr-1.5">Logg inn</span>
    <LogInIcon strokeWidth={1.5} class="w-[16px]" />
  </Button>
  <DarkMode size="sm" btnClass="h-9 border-[#999] rounded-2xl p-2.5" />
</div>
