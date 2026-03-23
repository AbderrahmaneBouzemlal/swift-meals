<script>
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/utils/routes.js';
	import AuthLayout from '$lib/components/layout/AuthLayout.svelte';

	let { children } = $props();

	const backMap = {
		[ROUTES.signUp.account]: ROUTES.signUp.chooseRole,
		[ROUTES.signUp.customer.profile]: ROUTES.signUp.account,
		[ROUTES.signUp.business.details]: ROUTES.signUp.account,
		[ROUTES.signUp.business.setup]: ROUTES.signUp.business.details,
		[ROUTES.signUp.review]: ROUTES.signUp.customer.profile // Default for review, might need more logic
	};

	let backUrl = $derived(
		backMap[$page.url.pathname] ?? ROUTES.signUp.chooseRole
	);
</script>

<AuthLayout>
	<div class="lg:hidden">
		<Header {backUrl} />
	</div>
	{@render children()}
</AuthLayout>
