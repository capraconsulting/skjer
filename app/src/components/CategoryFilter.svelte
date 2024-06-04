<script lang="ts">
  import { Button, ButtonGroup } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import type { Category } from "$models/sanity.model";
  import { goto } from "$app/navigation";

  export let selectedCategory: string | undefined;

  const dispatch = createEventDispatcher();
  const searchParams = new URLSearchParams();

  type Categories = { keyword: string; title: Category | "Alle" }[];
  const categories: Categories = [
    { title: "Alle", keyword: "" },
    { title: "Tech", keyword: "tech" },
    { title: "Design", keyword: "design" },
    { title: "Sosialt", keyword: "sosialt" },
  ];

  const handleCategoryChange = (category: string) => {
    dispatch("categoryChange", category);

    if (selectedCategory) {
      searchParams.set("category", selectedCategory);
    } else {
      searchParams.delete("category");
    }

    goto(`?${searchParams}`, { noScroll: true });
  };
</script>

<ButtonGroup class="mt-8 flex-col gap-2 shadow-none sm:flex-row">
  {#each categories as { title, keyword }}
    <Button
      on:click={() => handleCategoryChange(keyword)}
      class={`${selectedCategory === keyword ? "h-7 !rounded-xl border-black bg-zinc-800 text-white hover:bg-zinc-600" : "h-7 !rounded-xl border border-black "}`}
    >
      {title}
    </Button>
  {/each}
</ButtonGroup>
