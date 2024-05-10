<script lang="ts">
	import { isPreviewing, VisualEditing } from '@sanity/visual-editing/svelte';
	import { page } from '$app/stores';
	import LiveMode from '../components/LiveMode.svelte';
	import "../app.css";
</script>

{#if $isPreviewing}
	<a href={`/preview/disable?redirect=${$page.url.pathname}`} 
	class="rounded box-shadow text-gray-800 block text-xs shadow font-medium leading-4 fixed text-center z-50 px-3 py-2 right-4 bottom-4 hover:bg-red-500 hover:text-white group">
		<span class="block group-hover:hidden">Preview Enabled</span>
		<span class="hidden group-hover:block">Disable Preview</span>
	</a>
{/if}

<div class="sm:max-w-[768px] mx-auto">
	<header class="flex px-0 pt-2">
		<a class="p-2 sm:px-0 text-3xl font-bold mt-4" href="/">Hva skjer?</a>
	</header>
	<main class="my-8">
		<slot />
	</main>
</div>

{#if $isPreviewing}
	<VisualEditing />
	<LiveMode />
{/if}
