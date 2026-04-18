<script>
	import Icon from '../ui/Icon.svelte';
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.svg';
	import { ROUTES } from '$lib/utils/routes.js';
	import { enhance } from '$app/forms';

	let { role } = $props();

	const isBusiness = $derived(role === 'BUSINESS');

	const menuItems = $derived(
		isBusiness
			? [
					{ icon: 'order', label: 'Dashboard', href: ROUTES.dashboard.orders },
					{
						icon: 'booking',
						label: 'Meal Slots',
						href: ROUTES.dashboard.slots
					},
					{ icon: 'order', label: 'Menus', href: ROUTES.dashboard.menu.list },
					{ icon: 'history', label: 'History', href: ROUTES.dashboard.history },
					{ icon: 'profile', label: 'Account', href: ROUTES.account }
				]
			: [
					{ icon: 'order', label: 'Browse', href: ROUTES.home },
					{ icon: 'heart', label: 'Favorites', href: ROUTES.favorites },
					{ icon: 'history', label: 'Orders', href: ROUTES.dashboard.orders },
					{ icon: 'profile', label: 'Account', href: ROUTES.account }
				]
	);

	// ✅ startsWith so child routes also highlight the parent nav item
	function isActive(href) {
		const pathname = $page.url.pathname;
		// exact match for root-level routes like /account, /home
		if (href === ROUTES.home || href === ROUTES.account) {
			return pathname === href;
		}
		return pathname.startsWith(href);
	}
</script>

<aside
	class="flex h-screen w-64 flex-col border-r border-brand-gray-light
         bg-white px-4 py-8"
>
	<!-- logo -->
	<a href={ROUTES.home} class="mb-10 flex items-center gap-3 px-2">
		<img src={logo} alt="Swift Meals" class="h-10 w-10" />
		<span class="text-xl font-bold text-brand-dark italic">Swift Meals</span>
	</a>

	<!-- nav -->
	<nav class="flex flex-1 flex-col gap-2">
		{#each menuItems as item}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				class="flex items-center gap-4 rounded-xl px-4 py-3
               transition-all duration-200
               {active
					? 'bg-brand-yellow text-white shadow-lg shadow-brand-yellow/20'
					: 'text-brand-gray-dark hover:bg-brand-light hover:text-brand-yellow'}"
			>
				<Icon
					name={item.icon}
					width="24"
					height="24"
					color={active ? 'white' : 'currentColor'}
				/>
				<span class="font-medium italic">{item.label}</span>
			</a>
		{/each}
	</nav>

	<!-- logout -->
	<div class="mt-auto border-t border-brand-gray-light pt-4">
		<form method="POST" action="/account?/logout" use:enhance>
			<button
				type="submit"
				class="flex w-full items-center gap-4 rounded-xl px-4 py-3
               text-brand-gray-dark italic transition-all duration-200
               hover:bg-red-50 hover:text-red-500"
			>
				<Icon name="logout" width="24" height="24" color="currentColor" />
				<span class="font-medium italic">Logout</span>
			</button>
		</form>
	</div>
</aside>
