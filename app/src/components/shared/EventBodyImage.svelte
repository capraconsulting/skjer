<script lang="ts">
  import { urlFor } from "$lib/sanity/image";
  import type { CustomBlockComponentProps } from "@portabletext/svelte";

  interface EventBodyImageValue {
    _type: "image";
    alt?: string;
    asset?: {
      _ref: string;
      _type: "reference";
    };
    hotspot?: unknown;
    crop?: unknown;
  }

  export let portableText: CustomBlockComponentProps<EventBodyImageValue>;

  $: ({ value } = portableText);
  $: alt = value.alt || "Illustrasjon i arrangementsbeskrivelsen";
</script>

<div class="overflow-hidden rounded-xl">
  <img
    class="h-auto w-full object-cover"
    src={urlFor(value).width(1200).url()}
    {alt}
    loading="lazy"
  />
</div>