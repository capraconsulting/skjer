import type { PortableTextBlock } from '@portabletext/types';
import type { Image, ImageAsset, Slug } from '@sanity/types';
import groq from 'groq';

export const eventQuery = groq`*[_type == "event" && slug.current == $slug][0]`;

export const eventsQuery = groq`*[_type == "event" && defined(slug.current)] | order(_createdAt desc)`;

export interface Event {
	_type: 'event';
	_createdAt: string;
	title?: string;
	slug: Slug;
	summary?: string;
	mainImage?: ImageAsset
	body?: PortableTextBlock[];
}
