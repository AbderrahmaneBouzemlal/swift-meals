<script>
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/utils/routes.js';
	import AuthLayout from '$lib/components/layout/AuthLayout.svelte';

	let { children } = $props();

	// Map specific routes to their previous step
	const backMap = {
		[ROUTES.signUp.account]: null, // Use browser history only
		[ROUTES.signUp.chooseRole]: ROUTES.signUp.account, // Back to signup form
		[ROUTES.signUp.business.setup]: ROUTES.signUp.business.details,
		[ROUTES.signUp.business.details]: ROUTES.signUp.chooseRole,
		[ROUTES.signUp.customer.profile]: ROUTES.signUp.chooseRole
	};

	// Get back URL from map
	let backUrl = $derived(
		backMap.hasOwnProperty($page.url.pathname)
			? backMap[$page.url.pathname]
			: '/'
	);
</script>

<AuthLayout>
	<div class="lg:hidden">
		<Header {backUrl} />
	</div>
	{@render children()}
</AuthLayout>
