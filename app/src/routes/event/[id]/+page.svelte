<script lang="ts">
  import { PortableText } from "@portabletext/svelte";
  import { useQuery } from "@sanity/svelte-loader";
  import { page } from "$app/stores";
  import { urlFor } from "$lib/sanity/image";
  import RegistrationForm from "$components/RegistrationForm.svelte";
  import UnregistrationForm from "$components/UnregistrationForm.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zod } from "sveltekit-superforms/adapters";
  import { registrationSchema, unregistrationSchema } from "$lib/schemas/registrationSchema.js";
  import { Alert, Badge } from "flowbite-svelte";
  import EventParticipants from "$components/EventParticipants.svelte";
  import EventInfoBox from "$components/EventInfoBox.svelte";

  export let data;

  const { query, options, internalParticipantNames } = data;
  const result = useQuery({ query, options });

  $: ({ data: event } = $result);

  const {
    form: registrationForm,
    errors: registrationErrors,
    enhance: registrationEnhance,
    message: registrationMessage,
    delayed: registrationDelayed,
  } = superForm(data.registrationForm, {
    validators: zod(registrationSchema),
    delayMs: 200,
  });

  const {
    form: unregistrationForm,
    errors: unregistrationErrors,
    enhance: unregistrationEnhance,
    message: unregistrationMessage,
  } = superForm(data.unregistrationForm, {
    validators: zod(unregistrationSchema),
    delayMs: 200,
  });
</script>

<svelte:head>
  <title>{event.title} | Capra Liflig Fryde</title>
</svelte:head>

<section>
  <Badge rounded class="mb-4 h-6 border border-black bg-white">{event.category}</Badge>
  <h1 class="font-ligh pb-6 text-3xl sm:text-5xl">{event.title}</h1>
  {#if event.summary}
    <p class="pb-6 text-base font-light sm:text-xl">{event.summary}</p>
  {/if}

  <div class="flex flex-col gap-5 pb-6 sm:h-60 sm:flex-row">
    <div class="w-full sm:w-[40%]">
      <EventInfoBox {event} />
    </div>
    <div class="w-full sm:w-[60%]">
      <img
        class="w-full rounded-xl object-cover sm:h-full"
        src={urlFor(event.image).format("webp").url()}
        alt="Bilde for arrangementet: {event.title}"
      />
    </div>
  </div>

  {#if event.body}
    <div class="flex flex-col gap-4 text-base font-light sm:text-xl">
      <PortableText components={{}} value={event.body} />
    </div>
  {/if}

  <div class="flex flex-col gap-12 pt-8 sm:w-[60%]">
    {#if data.auth?.user}
      <div>
        <h2 class="mt-8 pb-4 text-base sm:text-xl">
          <span class="font-bold">Deltagere:</span>
        </h2>
        <EventParticipants {internalParticipantNames} />
      </div>
    {/if}

    <div class="py-6">
      <h2 class="pb-4 text-base font-bold sm:text-xl">Påmelding:</h2>
      {#if $registrationMessage?.success}
        <Alert color="green" class="mb-6"
          >Du har meldt deg på arrangementet! Du får en bekreftelse på <b
            >{$registrationMessage.email}</b
          > hvert øyeblikk.</Alert
        >
      {:else if $page?.status === 500}
        <Alert color="red" class="mb-6"
          >Det har skjedd en feil! Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.</Alert
        >
      {:else}
        <RegistrationForm
          {event}
          {registrationForm}
          {registrationErrors}
          {registrationEnhance}
          {registrationDelayed}
        />
      {/if}

      <UnregistrationForm {unregistrationForm} {unregistrationErrors} {unregistrationEnhance} />
      {#if $unregistrationMessage?.success}
        <!-- demo purpose -->
        <div class="w-[400px] break-words border border-gray-300 p-2 text-xs">
          {`/event/unregister/${$unregistrationMessage.token}`}
        </div>
      {/if}
    </div>
  </div>
</section>
