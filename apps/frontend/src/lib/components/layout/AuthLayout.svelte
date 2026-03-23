<script>
	import HeroImage from '$lib/components/HeroImage.svelte';

	let { children, showMobileHero = false } = $props();
</script>

<div class="flex min-h-dvh w-full overflow-hidden bg-white font-abeezee lg:bg-amber-100/60">
	<div class="mx-auto flex w-full max-w-7xl flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-16">
		<!-- Left: Branding Side -->
		<div
			class="hidden flex-1 lg:flex items-center justify-center rounded-3xl"
		>
			<div class="scale-150">
				<HeroImage hideOnMobile={true} />
			</div>
		</div>

		<!-- Right: Form/Content Side -->
		<div
			class="relative flex w-full flex-1 flex-col bg-white shadow-2xl lg:min-h-[700px] lg:w-[480px] lg:max-w-[480px] lg:shrink-0 lg:rounded-3xl lg:border lg:border-brand-gray-light lg:shadow-xl"
		>
			{#if showMobileHero}

				<div class="lg:hidden">
					<HeroImage />
				</div>
			{/if}
			<div class="flex flex-1 flex-col justify-center py-12">
				{@render children()}
			</div>
		</div>
	</div>
</div>
