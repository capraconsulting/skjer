<script lang="ts">
  import { isPreviewing, VisualEditing } from "@sanity/visual-editing/svelte";
  import { page } from "$app/stores";
  import LiveMode from "$components/shared/LiveMode.svelte";
  import "../app.css";
  import Header from "$components/shared/Header.svelte";
  import Footer from "$components/shared/Footer.svelte";

  let auth = $page.data.session;
</script>

{#if $isPreviewing}
  <a
    href={`/preview/disable?redirect=${$page.url.pathname}`}
    class="box-shadow group fixed bottom-4 right-4 z-50 block rounded px-3 py-2 text-center text-xs font-medium leading-4 text-gray-800 shadow hover:bg-red-500 hover:text-white"
  >
    <span class="block group-hover:hidden">Preview Enabled</span>
    <span class="hidden group-hover:block">Disable Preview</span>
  </a>
{/if}

<Header {auth} />

<div class="mx-auto min-h-[90vh] p-4 sm:max-w-[1000px]">
  <main class="mb-16 mt-8">
    <slot />
  </main>
</div>

<Footer />

{#if $isPreviewing}
  <VisualEditing />
  <LiveMode />
{/if}
