<script>
	import logo from '$lib/assets/logo.svg';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/utils/routes.js';
	import Icon from '../ui/Icon.svelte';

	let isMenuOpen = $state(false);

	const navLinks = [
		{ label: 'How it Works', href: '#how-it-works' },
		{ label: 'Features', href: '#features' },
		{ label: 'Support', href: ROUTES.support }
	];
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-brand-gray-light bg-white/80 backdrop-blur-md"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<!-- Logo -->
		<button onclick={() => goto(ROUTES.home)} class="flex items-center gap-3">
			<img src={logo} alt="Swift Meals" class="h-10 w-10" />
			<span class="text-xl font-bold text-brand-dark italic">Swift Meals</span>
		</button>

		<!-- Desktop Nav -->
		<nav class="hidden items-center gap-8 lg:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-medium text-brand-gray-dark italic transition-colors hover:text-brand-yellow"
				>
					{link.label}
				</a>
			{/each}
			<div class="ml-4 flex items-center gap-4">
				<button
					onclick={() => goto(ROUTES.signIn)}
					class="text-sm font-medium text-brand-dark italic hover:text-brand-yellow"
				>
					Sign In
				</button>
				<button
					onclick={() => goto(ROUTES.signUp.chooseRole)}
					class="rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-bold text-white italic shadow-lg shadow-brand-yellow/20 transition-all hover:scale-105 active:scale-95"
				>
					Get Started
				</button>
			</div>
		</nav>

		<!-- Mobile Menu Toggle -->
		<button
			class="lg:hidden"
			onclick={() => (isMenuOpen = !isMenuOpen)}
			aria-label="Toggle menu"
		>
			<Icon name={isMenuOpen ? 'fail' : 'order'} width="28" height="28" />
		</button>
	</div>

	<!-- Mobile Nav -->
	{#if isMenuOpen}
		<div class="border-t border-brand-gray-light bg-white p-6 lg:hidden">
			<nav class="flex flex-col gap-6">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-lg font-medium text-brand-gray-dark italic"
						onclick={() => (isMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<hr class="border-brand-gray-light" />
				<button
					onclick={() => {
						isMenuOpen = false;
						goto(ROUTES.signIn);
					}}
					class="text-left text-lg font-medium text-brand-dark italic"
				>
					Sign In
				</button>
				<button
					onclick={() => {
						isMenuOpen = false;
						goto(ROUTES.signUp.chooseRole);
					}}
					class="rounded-full bg-brand-yellow py-4 text-center text-lg font-bold text-white italic"
				>
					Get Started
				</button>
			</nav>
		</div>
	{/if}
</header>
