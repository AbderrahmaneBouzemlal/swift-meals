<script>
	import Icon from '../ui/Icon.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/utils/routes.js';

	/** @type {{ role: string }} */
	let { role } = $props();

	const isBusiness = $derived(role === 'business');

	const menuItems = $derived(
		isBusiness
			? [
					{ icon: 'order', label: 'Dashboard', href: ROUTES.dashboard.orders },
					{ icon: 'booking', label: 'Slots', href: ROUTES.dashboard.slots },
					{ icon: 'profile', label: 'Account', href: ROUTES.account }
				]
			: [
					{ icon: 'order', label: 'Browse', href: ROUTES.home },
					{ icon: 'heart', label: 'Favorites', href: ROUTES.favorites },
					{ icon: 'profile', label: 'Account', href: ROUTES.account }
				]
	);

	const isActive = (href) => $page.url.pathname === href;
</script>

<nav
	class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-brand-gray-light bg-white px-4 pt-3 pb-6 lg:hidden"
>
	{#each menuItems as item}
		<button
			onclick={() => goto(item.href)}
			class="flex flex-col items-center gap-1 transition-all duration-200 {isActive(item.href)
				? 'text-brand-yellow'
				: 'text-brand-gray'}"
		>
			<Icon
				name={item.icon}
				width="24"
				height="24"
				color={isActive(item.href) ? 'currentColor' : '#BDBDBD'}
			/>
			<span class="text-[10px] font-medium italic">{item.label}</span>
		</button>
	{/each}
</nav>
