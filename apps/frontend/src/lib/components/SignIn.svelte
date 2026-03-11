<script>
	import { goto } from '$app/navigation';
	import Header from './Header.svelte';
	import ChatButton from './ui/ChatButton.svelte';
	import SocialLoginButton from './ui/SocialLoginButton.svelte';
	import InputField from './ui/InputField.svelte';
	import PasswordInput from './ui/PasswordInput.svelte';
	import PrimaryButton from './ui/PrimaryButton.svelte';

	let email = '';
	let password = '';

	function handleSignIn() {
		goto('/account');
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl="/login" />

	<!-- Page title -->
	<div class="shrink-0 px-8 pt-2 pb-4">
		<h1 class="m-0 text-[28px] font-normal text-brand-dark italic">Sign In</h1>
	</div>

	<!-- Form -->
	<div class="flex shrink-0 flex-col gap-3 px-8">
		<!-- Email -->
		<InputField
			type="email"
			placeholder="Email"
			bind:value={email}
			icon="mail"
		/>

		<!-- Password -->
		<PasswordInput placeholder="Password" bind:value={password} />

		<!-- Forgot password -->
		<button
			class="cursor-pointer border-none bg-transparent p-0 text-left font-abeezee text-[12px] text-brand-gray italic transition-colors duration-200 hover:text-brand-yellow"
			>Forgot your password?</button
		>
	</div>

	<!-- Sign In Button -->
	<div class="flex shrink-0 justify-center px-8 py-5">
		<PrimaryButton text="Sign In" onclick={handleSignIn} />
	</div>

	<!-- OR divider + social -->
	<div class="flex shrink-0 flex-col items-center gap-3 px-8">
		<div class="flex w-full items-center gap-4">
			<div class="h-px flex-1 bg-brand-gray"></div>
			<span class="text-base text-brand-gray-dark italic">OR</span>
			<div class="h-px flex-1 bg-brand-gray"></div>
		</div>

		<p class="m-0 text-[18px] text-brand-gray-dark italic">Sign In using</p>

		<div class="flex items-center justify-center gap-4">
			<!-- Apple -->
			<SocialLoginButton provider="apple" />

			<!-- Google -->
			<SocialLoginButton provider="google" />

			<!-- Facebook -->
			<SocialLoginButton provider="facebook" />
		</div>
	</div>

	<!-- Bottom: Need an account -->
	<div class="flex flex-1 shrink-0 items-end justify-center gap-2 pt-4 pb-3">
		<span class="text-[18px] text-brand-gray-dark italic">Need An Account?</span
		>
		<button
			class="cursor-pointer border-none bg-transparent p-0 font-abeezee text-[18px] font-semibold text-brand-yellow italic transition-opacity duration-200 hover:opacity-80"
			onclick={() => goto('/sign-up')}>Sign Up</button
		>
	</div>

	<!-- Chat button -->
	<div class="flex flex-1 items-end">
		<ChatButton />
	</div>
</div>
