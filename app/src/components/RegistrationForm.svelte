<script lang="ts">
	import type { RegistrationData } from '../models/registration-data.model';

    export let formData: RegistrationData;

    let name = formData.name ?? '';
    let email = formData.email ?? '';

    $: result = {
		name, email
	};
</script>

<h2 class="text-2xl font-bold pb-4">Meld deg på</h2>

<form class="flex flex-col gap-8" method="POST">
    <div class="flex flex-col gap-2">
        <label for="name">Navn</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="name" id="name" bind:value={name} />
    </div>

    <div class="flex flex-col gap-2">
        <label for="email">E-post</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="email" name="email" id="email" bind:value={email} />
    </div>
    
    <button class="w-52 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 rounded" type="submit">Send inn</button>
</form>
