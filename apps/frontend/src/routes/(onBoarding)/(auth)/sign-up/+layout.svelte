<script>
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';

	const backMap = {
		'/sign-up': '/choose-role',
		'/sign-up/customer/profile': '/sign-up',
		'/sign-up/business/details': '/sign-up',
		'/sign-up/business/setup': '/sign-up/business/details'
	};

	let backUrl = backMap[$page.url.pathname] ?? '/choose-role';
</script>

<slot />
