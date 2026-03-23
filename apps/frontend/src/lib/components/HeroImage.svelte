<script>
	import logo from '../assets/logo.svg';
	import Title from '$lib/components/ui/Title.svelte';
	import Subtitle from '$lib/components/ui/Subtitle.svelte';

	let { hideOnMobile = false } = $props();
</script>

<div
	class="relative flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-[#FDFAF4] {hideOnMobile
		? 'hidden lg:flex'
		: 'flex'}"
>
	<div
		class="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2
           rounded-full bg-amber-100/60 blur-3xl"
	></div>

	<div class="z-10 flex flex-col items-center gap-3 pb-10">
		<div
			class="animate-float h-64 w-64 drop-shadow-[0_8px_24px_rgba(251,191,36,0.35)]"
		>
			<img
				src={logo}
				alt="Swift Meals logo"
				class="h-full w-full object-contain"
			/>
		</div>

		<div class="flex flex-col items-center gap-1.5">
			<Title
				size="large"
				weight="bold"
				color="stone-800"
				class="tracking-tight"
			>
				Swift Meals
			</Title>
			<Subtitle size="small" color="stone-400" class="tracking-wide">
				Delicious, delivered fast
			</Subtitle>
		</div>
	</div>
</div>
