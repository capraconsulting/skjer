<script lang="ts">
  import { PortableText } from "@portabletext/svelte";
  import { useQuery } from "@sanity/svelte-loader";
  import { page } from "$app/stores";
  import { formatDate, formatTime } from "$lib/utils";
  import { urlFor } from "$lib/sanity/image";
  import RegistrationForm from "$components/RegistrationForm.svelte";
  import UnregistrationForm from "$components/UnregistrationForm.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zod } from "sveltekit-superforms/adapters";
  import { registrationSchema, unregistrationSchema } from "$lib/schemas/registrationSchema.js";
  import { Alert, Badge } from "flowbite-svelte";
  import EventParticipants from "$components/EventParticipants.svelte";
  import { MapPin, Clock } from "phosphor-svelte";

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

<section class="mx-0 mb-80 mt-2 w-full">
  {#if event.image}
    <img
      class="h-[380px] w-full object-cover"
      src={urlFor(event.image).width(968).height(380).format("webp").url()}
      alt="Cover image for {event.title}"
    />
  {/if}
  <div class="py-0 pl-3 pr-4">
    <h1 class="my-8 text-6xl font-extrabold leading-tight">{event.title}</h1>
    {#if event.summary}
      <p class="text-2xl">{event.summary}</p>
    {/if}
    <div class="my-6 font-light">
      <div class="flex items-center">
        <Clock size="1.25rem" class="mr-2" />
        <p>
          {formatDate(event.start)}
          {formatTime(event.start)}
        </p>
      </div>
      <div class="flex items-center">
        <MapPin size="1.25rem" class="mr-2" />
        <p>{event.place}</p>
      </div>
      <Badge class="mt-4" large color="dark">{event.category}</Badge>
    </div>

    {#if event.body}
      <div class="mt-8 flex flex-col gap-4">
        <PortableText components={{}} value={event.body} />
      </div>
    {/if}

    <div class="flex flex-col gap-12 py-8 sm:w-[70%]">
      {#if data.auth?.user}
        <div>
          <h2 class="mt-8 pb-4 text-2xl">
            <span class="font-bold">Deltakere</span>
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
  </div>
</section>
