<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import { useQuery } from '@sanity/svelte-loader';
	import { formatDate } from '$lib/utils';
	import { urlFor } from '$lib/sanity/image';
	import type { PageData } from './$types';

	export let data: PageData;
	const q = useQuery(data);

	$: ({ data: event } = $q);
</script>

<section class="event">
	{#if event.mainImage}
		<img
			class="event__cover"
			src={urlFor(event.mainImage).url()}
			alt="Cover image for {event.title}"
		/>
	{:else}
		<div class="event__cover--none" />
	{/if}
	<div class="event__container">
		<h1 class="event__title">{event.title}</h1>
		{#if event.summary}
			<p class="event__excerpt">{event.summary}</p>
		{/if}
		<p class="event__date">
			{formatDate(event._createdAt)}
		</p>
		{#if event.body}
			<div class="event__content">
				<PortableText components={{}} value={event.body} />
			</div>
		{/if}
	</div>
</section>

<style>
	.event {
		width: 100%;
		margin: var(--space-1) 0 var(--space-4);
	}

	.event .event__cover,
	.event .event__cover--none {
		width: 100%;
		height: 200px;
		-o-object-fit: cover;
		object-fit: cover;
	}

	.event .event__cover--none {
		background: var(--black);
	}

	.event .event__container {
		padding: 0 var(--space-3);
	}

	.event .event__content {
		font-family: var(--font-family-serif);
		font-weight: 400;
		font-size: var(--font-size-4);
		line-height: var(--line-height-5);
		letter-spacing: -0.02em;
		margin-top: var(--space-6);
	}

	.event .event__content blockquote {
		border-left: 5px solid var(--black);
		padding-left: var(--space-3);
		margin-left: var(--space-4);
	}

	.event .event__content a {
		color: var(--blue-600);
		text-decoration: none;
	}

	.event .event__title {
		font-family: var(--font-family-sans);
		font-size: var(--font-size-7);
		line-height: var(--line-height-6);
		margin: var(--space-4) 0;
		font-weight: 800;
	}

	.event .event__excerpt {
		font-family: var(--font-family-serif);
		font-size: var(--font-size-5);
		line-height: var(--line-height-4);
		margin-top: 0;
		font-weight: 400;
	}

	.event .event__date {
		font-family: var(--font-family-sans);
		font-weight: 600;
		font-family: var(--font-family-sans);
		font-size: var(--font-size-1);
		line-height: var(--line-height-1);
		margin-top: var(--space-4);
	}

	@media (min-width: 800px) {
		.event .event__cover,
		.event .event__cover--none {
			width: 750px;
			height: 380px;
		}

		.event .event__title {
			font-size: var(--font-size-10);
			line-height: var(--line-height-10);
			margin: var(--space-6) 0 0;
			letter-spacing: -0.025em;
		}

		.event .event__excerpt {
			font-size: var(--font-size-5);
			line-height: var(--line-height-5);
			margin-top: var(--space-3);
			margin-bottom: var(--space-3);
		}

		.event .event__date {
			font-size: var(--font-size-3);
			line-height: var(--line-height-2);
			margin-top: var(--space-0);
		}

		.event .event__content {
			margin-top: var(--space-7);
		}
	}
</style>
