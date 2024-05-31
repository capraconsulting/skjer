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

    <div class="py-8 sm:w-[70%] flex flex-col gap-12">
      {#if data.auth?.user}
        <div>
          <h2 class="text-2xl pb-4 mt-8">
            <span class="font-bold">Deltakere</span>
            {#if internalParticipantNames?.length}
              <span class="font-light">({internalParticipantNames.length})</span>
            {/if}
          </h2>
          <EventParticipants {internalParticipantNames} />
        </div>
      {/if}

      <div class="py-8">
        <h2 class="text-2xl font-bold pb-4">Meld deg på</h2>
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
          <div class="w-[400px] p-2 border text-xs border-gray-300 break-words">
            {`/event/unregister/${$unregistrationMessage.token}`}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
