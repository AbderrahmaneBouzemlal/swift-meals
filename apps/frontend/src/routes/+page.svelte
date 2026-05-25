<script>
	import ListingPage from '$lib/components/pages/ListingPage.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import LandingLayout from '$lib/components/layout/LandingLayout.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
	import HeroImage from '$lib/components/HeroImage.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { platform } from '$lib/hooks/platform.svelte.js';
	import AuthLayout from '$lib/components/layout/AuthLayout.svelte';
	import LandingPage from '$lib/components/LandingPage.svelte';

	let { data } = $props();
	let user = $derived(data?.user);
</script>

{#if platform.isCapacitor}
	<AuthLayout showMobileHero={true}>
		<div
			class="flex h-full flex-col items-center justify-center gap-4 rounded-t-3xl bg-[#FDFAF4] px-8 pt-12 pb-24
			shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:rounded-none lg:bg-white lg:shadow-none"
		>
			<PrimaryButton
				text="Get Started"
				icon="arrow-right"
				onclick={() => goto(resolve(ROUTES.signUp.chooseRole))}
			/>
			<PrimaryButton
				text="Sign In"
				variant="secondary"
				onclick={() => goto(resolve(ROUTES.signIn))}
			/>
		</div>
	</AuthLayout>
{:else if platform.isLoaded}
	{#if user}
		<ListingPage />
	{:else}
		<LandingPage />
	{/if}
{/if}

<style>
	:global(.animate-float) {
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
			opacity: 1;
		}
		50% {
			transform: translateY(-20px);
			opacity: 1;
		}
	}
</style>
