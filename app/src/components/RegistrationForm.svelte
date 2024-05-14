
<script lang="ts">
    import type { RegistrationData } from '$models/registration-data.model';
    import type { Event } from '$lib/sanity/queries';
  import { Allergy } from '$models/allergy.model';
    
    export let formData: RegistrationData;
    export let event: Event;

    let allergies = Object.values(Allergy);
</script>

<form class="flex flex-col gap-6" method="POST" action="?/submitRegistration">
    <div class="flex flex-col gap-2">
        <label class="font-bold" for="name">Navn*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="name" id="name" bind:value={formData.name} required />
    </div>

    <div class="flex flex-col gap-2">
        <label class="font-bold" for="email">E-post*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="email" name="email" id="email" bind:value={formData.email} required />
    </div>

    <div class="flex flex-col gap-2">
        <label class="font-bold" for="telephone">Telefonnummer*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="tel" name="telephone" id="telephone" bind:value={formData.telephone} required />
    </div>

    <div class="flex flex-col gap-2">
        <label class="font-bold" for="firm">Firma*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="firm" id="firm" bind:value={formData.firm} required />
    </div>

    {#if event.allergy}
        <label class="font-bold" for="allergies">Allergier</label>
        <select multiple bind:value={formData.allergies}>
            {#each allergies as allergy}
                <option value={allergy}>
                    { allergy }
                </option>
            {/each}
        </select>

        <input hidden type="text" name="allergies" id="allergies" bind:value={formData.allergies} />
    {/if}

    <button class="w-52 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 rounded" type="submit">Send inn</button>
</form>
