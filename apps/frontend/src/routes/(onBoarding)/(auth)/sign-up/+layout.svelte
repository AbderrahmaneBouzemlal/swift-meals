<script>
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/utils/routes.js';

	const backMap = {
		[ROUTES.signUp.account]: ROUTES.signUp.chooseRole,
		[ROUTES.signUp.customer.profile]: ROUTES.signUp.account,
		[ROUTES.signUp.business.details]: ROUTES.signUp.account,
		[ROUTES.signUp.business.setup]: ROUTES.signUp.business.details
	};

	let backUrl = backMap[$page.url.pathname] ?? ROUTES.signUp.chooseRole;
</script>

<slot />
