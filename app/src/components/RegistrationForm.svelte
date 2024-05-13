
<script lang="ts">
    import type { RegistrationData } from '../models/registration-data.model';
    
    export let formData: RegistrationData;
</script>

<form class="flex flex-col gap-6" on:submit|preventDefault>
    <div class="flex flex-col gap-2">
        <label for="name">Navn</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="name" id="name" bind:value={formData.full_name} />
    </div>

    <div class="flex flex-col gap-2">
        <label for="email">E-post</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="email" name="email" id="email" bind:value={formData.email} />
    </div>

    <div class="flex flex-col gap-2">
        <label for="telephone">Telefonnummer</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="tel" name="telephone" id="telephone" bind:value={formData.telephone} />
    </div>

    <div class="flex flex-col gap-2">
        <label for="firm">Firma</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="firm" id="firm" bind:value={formData.firm} />
    </div>

    <button class="w-52 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 rounded" type="submit">Send inn</button>
</form>
