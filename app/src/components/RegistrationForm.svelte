
<script lang="ts">
    import type { Event } from '$lib/sanity/queries';
    import { Allergy } from '$models/allergy.model';
    
    export let form;
    export let event: Event;

    let allergies = Object.values(Allergy);
    
</script>

<form class="flex flex-col gap-6" method="POST" action="?/submitRegistration">
    <div class="flex flex-col gap-2">
        <label class="font-bold" for="name">Navn*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="name" id="name" bind:value={$form.name} required />
    </div>

    <div class="flex flex-col gap-2">
        <label class="font-bold" for="email">E-post*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="email" name="email" id="email" bind:value={$form.email} required />
    </div>

    <div class="flex flex-col gap-2">
        <label class="font-bold" for="telephone">Telefonnummer*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="tel" name="telephone" id="telephone" bind:value={$form.telephone} required />
    </div>

    <div class="flex flex-col gap-2">
        <label class="font-bold" for="firm">Firma*</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="firm" id="firm" bind:value={$form.firm} required />
    </div>

    {#if event.allergy}
        <label class="font-bold" for="allergies">Allergier</label>
        <select multiple bind:value={$form.allergies} name="allergies" id="allergies">
            {#each allergies as allergy}
                <option value={allergy}>{allergy}</option>
            {/each}
        </select>
    {/if}

    <button class="w-52 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 rounded" type="submit">Send inn</button>
</form>
