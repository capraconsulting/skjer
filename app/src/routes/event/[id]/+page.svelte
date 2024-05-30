<script lang="ts">
  import { PortableText } from "@portabletext/svelte";
  import { useQuery } from "@sanity/svelte-loader";
  import { page } from "$app/stores";
  import { formatDate, formatTime } from "$lib/utils";
  import { urlFor } from "$lib/sanity/image";
  import RegistrationForm from "$components/RegistrationForm.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zod } from "sveltekit-superforms/adapters";
  import { registrationSchema } from "$lib/schemas/registrationSchema.js";
  import { Alert, Badge } from "flowbite-svelte";

  export let data;

  const { query, options } = data;
  const result = useQuery({ query, options });

  $: ({ data: event } = $result);

  const { form, errors, enhance, message, delayed } = superForm(data.form, {
    validators: zod(registrationSchema),
    delayMs: 200,
  });
</script>

<section class="w-full mt-2 mb-80 mx-0">
  {#if event.image}
    <img
      class="w-full h-[380px] object-cover"
      src={urlFor(event.image).url()}
      alt="Cover image for {event.title}"
    />
  {/if}
  <div class="pr-4 pl-3 py-0">
    <h1 class="text-6xl font-extrabold leading-tight my-8">{event.title}</h1>
    {#if event.summary}
      <p class="text-2xl">{event.summary}</p>
    {/if}
    <div class="my-6 font-light">
      <div class="flex">
        <span class="material-icons mr-2">schedule</span>
        <p>
          {formatDate(event.start)}
          {formatTime(event.start)}
        </p>
      </div>
      <div class="flex">
        <span class="material-icons mr-2">location_on</span>
        <p>{event.place}</p>
      </div>
      <Badge class="mt-4" large color="dark">{event.category}</Badge>
    </div>
    {#if event.body}
      <div class="mt-8 flex flex-col gap-4">
        <PortableText components={{}} value={event.body} />
      </div>
    {/if}

    <div class="py-8">
      <h2 class="text-2xl font-bold pb-4">Meld deg på</h2>
      {#if $message?.success === true}
        <Alert color="green" class="mb-6"
          >Du har meldt deg på arrangementet! Du får en bekreftelse på <b>{$message.email}</b> hvert
          øyeblikk.</Alert
        >
      {/if}

      {#if $page?.status === 500}
        <Alert color="red" class="mb-6"
          >Det har skjedd en feil! Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.</Alert
        >
      {/if}

      {#if !$message}
        <RegistrationForm {form} {errors} {enhance} {delayed} {event} />
      {/if}
    </div>
  </div>
</section>
