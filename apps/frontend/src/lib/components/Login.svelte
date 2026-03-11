<script>
	import { goto } from '$app/navigation';
	import ChatButton from './ui/ChatButton.svelte';
	import PrimaryButton from './ui/PrimaryButton.svelte';
	import Header from './Header.svelte';
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl="/" />
	<div class="flex flex-1 flex-col items-center gap-20 px-8 pt-5">
		<div class="flex flex-col items-center gap-2 text-center">
			<h1 class="m-0 mt-8 text-4xl font-normal text-brand-dark italic">
				Hello!
			</h1>
			<p class="m-0 text-[15px] text-subtext-gray italic">
				Welcome to Swift Meals
			</p>
		</div>

		<div class="flex w-full flex-col items-center">
			<PrimaryButton text="Sign In" onclick={() => goto('sign-in')} />

			<div class="flex w-full items-center gap-4 py-5">
				<div class="h-px flex-1 bg-brand-gray"></div>
				<span class="text-base text-brand-gray-dark italic">OR</span>
				<div class="h-px flex-1 bg-brand-gray"></div>
			</div>

			<PrimaryButton
				text="Sign Up"
				variant="secondary"
				onclick={() => goto('/choose-role')}
			/>
		</div>
	</div>

	<div class="flex flex-1 items-end">
		<ChatButton />
	</div>
</div>
