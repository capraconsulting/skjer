<script lang="ts">
  import { stegaClean } from "@sanity/client/stega";
  import { urlFor } from "$lib/sanity/image";
  import type { CustomBlockComponentProps } from "@portabletext/svelte";

  interface EventBodyImageValue {
    _type: "eventBodyImage" | "image";
    alt?: string;
    caption?: string;
    placement?: "full" | "left" | "right" | "center";
    size?: "small" | "medium" | "large";
    image?: {
      asset?: {
        _ref: string;
        _type: "reference";
      };
      hotspot?: unknown;
      crop?: unknown;
      alt?: string;
    };
    asset?: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: unknown;
    crop?: unknown;
  }

  export let portableText: CustomBlockComponentProps<EventBodyImageValue>;

  $: ({ value } = portableText);
  $: imageSource = value.image || value;
  $: alt = stegaClean(value.alt) || stegaClean(value.image?.alt) || "Illustrasjon i arrangementsbeskrivelsen";
  $: caption = stegaClean(value.caption);
  $: placement = stegaClean(value.placement) || "full";
  $: size = stegaClean(value.size) || "medium";
  $: className = `event-body-image event-body-image--${placement} event-body-image--${size}`;
</script>

<figure class={className}>
  <div class="overflow-hidden rounded-xl bg-zinc-100">
    <img
      class="h-auto w-full object-cover"
      src={urlFor(imageSource).width(1200).url()}
      {alt}
      loading="lazy"
    />
  </div>
  {#if caption}
    <figcaption class="pt-2 text-sm text-zinc-600">{caption}</figcaption>
  {/if}
</figure>