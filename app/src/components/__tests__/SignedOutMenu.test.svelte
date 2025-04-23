<script lang="ts">
  export let signInHandler;
  export let isSigningIn;
</script>

<div class="flex items-center gap-3">
  <button
    class="h-9 border-[#999]"
    on:click={signInHandler}
    disabled={isSigningIn}
  >
    <span class="mr-1.5">Logg inn</span>
    <span class="w-[16px]">Icon</span>
  </button>
  <div data-testid="dark-mode"></div>
</div>
