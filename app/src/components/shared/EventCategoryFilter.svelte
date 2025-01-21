<script lang="ts">
  import { Button, ButtonGroup } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import type { Category } from "$models/sanity.model";
  import { goto } from "$app/navigation";

  export let selectedCategory: string;

  const dispatch = createEventDispatcher();
  const searchParams = new URLSearchParams();

  type Categories = { keyword: string; title: Category | "Alle" }[];
  const categories: Categories = [
    { title: "Alle", keyword: "" },
    { title: "Tech", keyword: "tech" },
    { title: "Design", keyword: "design" },
    { title: "Sosialt", keyword: "sosialt" },
  ];

  const handleCategoryChange = async (category: string) => {
    dispatch("categoryChange", category);

    if (category) {
      searchParams.set("category", category);
    } else {
      searchParams.delete("category");
    }

    await goto(`?${searchParams.toString()}`, { noScroll: true });
  };
</script>

<ButtonGroup class="flex-row flex-wrap gap-2 pb-7 shadow-none md:self-end">
  {#each categories as { title, keyword }}
    <Button
      on:click={() => handleCategoryChange(keyword)}
      class={`${
        selectedCategory === keyword
          ? "h-8 !rounded-lg !border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-600"
          : "h-8 !rounded-lg border border-[#999] hover:border-black hover:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-700"
      }`}
    >
      {title}
    </Button>
  {/each}
</ButtonGroup>
