<script lang="ts">
  import { isPreviewing, VisualEditing } from "@sanity/visual-editing/svelte";
  import { page } from "$app/stores";
  import LiveMode from "../components/LiveMode.svelte";
  import "../app.css";
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";
</script>

{#if $isPreviewing}
  <a
    href={`/preview/disable?redirect=${$page.url.pathname}`}
    class="rounded box-shadow text-gray-800 block text-xs shadow font-medium leading-4 fixed text-center z-50 px-3 py-2 right-4 bottom-4 hover:bg-red-500 hover:text-white group"
  >
    <span class="block group-hover:hidden">Preview Enabled</span>
    <span class="hidden group-hover:block">Disable Preview</span>
  </a>
{/if}

<Header />

<div class="sm:max-w-[1000px] min-h-[90vh] mx-auto">
  <main class="mt-8 mb-16">
    <slot />
  </main>
</div>

<Footer />

{#if $isPreviewing}
  <VisualEditing />
  <LiveMode />
{/if}
