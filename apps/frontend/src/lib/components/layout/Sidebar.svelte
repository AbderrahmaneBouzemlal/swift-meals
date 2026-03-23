<script>
	import Icon from '../ui/Icon.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.svg';
	import { ROUTES } from '$lib/utils/routes.js';

	/** @type {{ role: string }} */
	let { role } = $props();

	const isBusiness = $derived(role === 'business');

	const menuItems = $derived(
		isBusiness
			? [
					{ icon: 'order', label: 'Dashboard', href: ROUTES.dashboard.orders },
					{ icon: 'booking', label: 'Meal Slots', href: ROUTES.dashboard.slots },
					{ icon: 'history', label: 'History', href: ROUTES.dashboard.history },
					{ icon: 'profile', label: 'Account', href: ROUTES.account }
				]
			: [
					{ icon: 'order', label: 'Browse', href: ROUTES.home },
					{ icon: 'heart', label: 'Favorites', href: ROUTES.favorites },
					{ icon: 'history', label: 'Orders', href: ROUTES.orders },
					{ icon: 'profile', label: 'Account', href: ROUTES.account }
				]
	);

	const isActive = (href) => $page.url.pathname === href;
</script>

<aside class="flex h-screen w-64 flex-col border-r border-brand-gray-light bg-white px-4 py-8">
	<!-- Logo -->
	<div class="mb-10 flex items-center gap-3 px-2">
		<img src={logo} alt="Logo" class="h-10 w-10" />
		<span class="text-xl font-bold text-brand-dark italic">Swift Meals</span>
	</div>

	<!-- Navigation -->
	<nav class="flex flex-1 flex-col gap-2">
		{#each menuItems as item}
			<button
				onclick={() => goto(item.href)}
				class="flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 {isActive(
					item.href
				)
					? 'bg-brand-yellow text-white shadow-lg shadow-brand-yellow/20'
					: 'text-brand-gray-dark hover:bg-brand-light hover:text-brand-yellow'}"
			>
				<Icon
					name={item.icon}
					width="24"
					height="24"
					color={isActive(item.href) ? 'white' : 'currentColor'}
				/>
				<span class="font-medium italic">{item.label}</span>
			</button>
		{/each}
	</nav>

	<!-- Logout -->
	<div class="mt-auto pt-4 border-t border-brand-gray-light">
		<form method="POST" action="/account?/logout">
			<button
				type="submit"
				class="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-brand-gray-dark transition-all duration-200 hover:bg-red-50 hover:text-red-500"
			>
				<Icon name="logout" width="24" height="24" color="currentColor" />
				<span class="font-medium italic">Logout</span>
			</button>
		</form>
	</div>
</aside>
