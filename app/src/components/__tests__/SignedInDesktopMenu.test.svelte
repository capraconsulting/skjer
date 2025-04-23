<script lang="ts">
  import { page } from "$app/stores";

  export let auth;
  export let isSigningOut;
  export let openSanityStudio;
  export let signOutHandler;

  const subscribeLink = `https://www.google.com/calendar/render?cid=webcal://example.com/api/subscribe`;
</script>

<div class="hidden flex-row items-center gap-3 md:flex">
  <span class="text-sm font-semibold">{auth.user.name}</span>
  <img class="h-8 rounded-2xl" alt="Profilbilde" src={auth.user.image} />

  <button class="h-9" on:click={openSanityStudio}>
    <span class="mr-1.5">Opprett</span>
    <span class="w-[16px]">+</span>
  </button>
  <a
    class="h-9 rounded-2xl border-[#999] p-2.5"
    target="_blank"
    rel="noopener noreferrer"
    href={subscribeLink}
    alt="Abonner på kalender"
  >
    <span class="mr-1.5">Abonner</span>
    <span class="w-[16px]">📅</span>
  </a>
  <button
    class="h-9 border-[#999]"
    on:click={signOutHandler}
    disabled={isSigningOut}
  >
    <span class="mr-1.5">Logg ut</span>
    <span class="w-[16px]">🚪</span>
  </button>

  <div data-testid="dark-mode"></div>
</div>
