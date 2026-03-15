<script>
	import { goto } from '$app/navigation';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Header from '$lib/components/Header.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import Subtitle from '$lib/components/ui/Subtitle.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl={ROUTES.login} />
	<div class="flex flex-1 flex-col items-center gap-20 px-8 pt-5">
		<div class="flex flex-col items-center gap-2 text-center">
			<Title size="large" align="center" class="mt-8">Hello!</Title>
			<Subtitle size="medium" align="center">Welcome to Swift Meals</Subtitle>
		</div>

		<div class="flex w-full flex-col items-center">
			<PrimaryButton text="Sign In" onclick={() => goto(ROUTES.signIn)} />

			<div class="flex w-full items-center gap-4 py-5">
				<div class="h-px flex-1 bg-brand-gray"></div>
				<span class="text-base text-brand-gray-dark italic">OR</span>
				<div class="h-px flex-1 bg-brand-gray"></div>
			</div>

			<PrimaryButton
				text="Sign Up"
				variant="secondary"
				onclick={() => goto(ROUTES.chooseRole)}
			/>
		</div>
	</div>
</div>
