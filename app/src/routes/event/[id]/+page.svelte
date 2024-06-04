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

<section>
  <Badge rounded class="mb-4 h-6 border border-black bg-white">{event.category}</Badge>
  <h1 class="font-ligh pb-6 text-4xl">{event.title}</h1>
  {#if event.summary}
    <p class="pb-6 text-lg font-light">{event.summary}</p>
  {/if}

  <div class="flex h-52 flex-row gap-5 pb-6">
    <EventInfoBox {event} />
    <img
      class="h-full w-full rounded-xl object-cover"
      src={urlFor(event.image).format("webp").url()}
      alt="Bilde for arrangementet: {event.title}"
    />
  </div>

  {#if event.body}
    <div class="flex flex-col gap-4 text-lg">
      <PortableText components={{}} value={event.body} />
    </div>
  {/if}

  <div class="flex flex-col gap-12 py-8 sm:w-[70%]">
    {#if data.auth?.user}
      <div>
        <h2 class="mt-8 pb-4 text-2xl">
          <span class="font-light">Deltakere</span>
          {#if internalParticipantNames?.length}
            <span class="font-light">({internalParticipantNames.length})</span>
          {/if}
        </h2>
        <EventParticipants {internalParticipantNames} />
      </div>
    {/if}

    <div class="py-8">
      <h2 class="pb-4 text-2xl font-bold">Meld deg på</h2>
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
