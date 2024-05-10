<script lang="ts">
	import type { RegistrationData } from '../models/registration-data.model';

    export let formData: RegistrationData;

    let name = formData.name ?? '';
    let email = formData.email ?? '';
    let telephone = formData.telephone ?? '';
    let firm = formData.firm ?? '';


    $: result = {
		name, email, telephone, firm
	};

	function subitForm() {
		console.log(result);
	};

</script>

<h2 class="text-2xl font-bold pb-4">Meld deg på</h2>

<form class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
        <label for="name">Navn</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="text" name="name" id="name" bind:value={name} />
    </div>

    <div class="flex flex-col gap-2">
        <label for="email">E-post</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="email" name="email" id="email" bind:value={email} />
    </div>
    
    <div class="flex flex-col gap-2">
        <label for="telephone">Telefonnummer</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="telephone" name="telephone" id="telephone" bind:value={telephone} />
    </div>
    
    <div class="flex flex-col gap-2">
        <label for="firm">Firma</label>
        <input class="border rounded w-full-py-2 px-3 text-gray-700 h-8" type="firm" name="firm" id="firm" bind:value={firm} />
    </div>
    
    <button class="w-52 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 rounded" type="submit" on:click={subitForm}>Send inn</button>
</form>

<div class="py-8">
    <pre>
        {JSON.stringify(result, null, 2)}
    </pre>
</div>