<script>
	import { goto } from '$app/navigation';
	import HeroImage from '$lib/components/HeroImage.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Subtitle from '$lib/components/ui/Subtitle.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<HeroImage />
	<div
		class="flex shrink-0 flex-col items-center gap-4 rounded-t-3xl bg-[#FDFAF4] px-8 pt-7
		pb-18 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
	>
		<Subtitle size="xl" color="brand-gray-dark">Let's get started</Subtitle>
		<PrimaryButton
			text="Continue"
			icon="arrow-right"
			onclick={() => goto(ROUTES.login)}
		/>
	</div>
</div>
