<script lang="ts">
  import { PortableText } from "@portabletext/svelte";
  import { useQuery } from "@sanity/svelte-loader";
  import { formatDate, formatTime } from "$lib/utils";
  import { urlFor } from "$lib/sanity/image";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import RegistrationForm from "$components/RegistrationForm.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zod } from "sveltekit-superforms/adapters";
  import { registrationSchema } from "$lib/schemas/registrationSchema.js";

  export let data;

  const q = useQuery(data);

  $: ({ data: event } = $q);

  const { form, errors, enhance } = superForm(data.form, { validators: zod(registrationSchema) });
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
    <h1 class="text-6xl font-extrabold leading-loose">{event.title}</h1>
    {#if event.summary}
      <p class="text-2xl">{event.summary}</p>
    {/if}
    <div class="my-6 font-bold">
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
    </div>
    {#if event.body}
      <div class="mt-8 flex flex-col gap-4">
        <PortableText components={{}} value={event.body} />
      </div>
    {/if}
    <div class="flex items-center justify-end">
      {#if data.auth?.user}
        <span class="font-semibold mr-1">{data.auth.user.name}</span>
        <button
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          on:click={() => signOut({ callbackUrl: "/" })}>Logg ut</button
        >
      {:else}
        <button
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          on:click={() => signIn("google")}>Logg inn</button
        >
      {/if}
    </div>

    <div class="py-8">
      <h2 class="text-2xl font-bold pb-4">Meld deg på</h2>
      <RegistrationForm {form} {errors} {enhance} {event} />
    </div>
  </div>
</section>
