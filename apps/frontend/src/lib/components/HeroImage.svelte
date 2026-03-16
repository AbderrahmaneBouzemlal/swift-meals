<script>
	import logo from '../assets/logo.svg';
	import Title from '$lib/components/ui/Title.svelte';
	import Subtitle from '$lib/components/ui/Subtitle.svelte';
</script>

<div
	class="relative flex flex-1 items-center justify-center overflow-hidden bg-[#FDFAF4]"
>
	<!-- subtle radial glow behind the logo -->
	<div
		class="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2
           rounded-full bg-amber-100/60 blur-3xl"
	></div>

	<!-- faint grain texture overlay -->
	<div
		class="[background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')] absolute inset-0 opacity-[0.03]"
	></div>

	<div class="z-10 flex flex-col items-center gap-3 pb-10">
		<!-- logo floats -->
		<div
			class="animate-float h-64 w-64 drop-shadow-[0_8px_24px_rgba(251,191,36,0.35)]"
		>
			<img
				src={logo}
				alt="Swift Meals logo"
				class="h-full w-full object-contain"
			/>
		</div>

		<!-- tight text stack -->
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
