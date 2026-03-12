<script>
	import Header from './Header.svelte';
	import ChatButton from './ui/ChatButton.svelte';
	import SocialLoginButton from './ui/SocialLoginButton.svelte';
	import InputField from './ui/InputField.svelte';
	import PasswordInput from './ui/PasswordInput.svelte';
	import Icon from './ui/Icon.svelte';
	import PrimaryButton from './ui/PrimaryButton.svelte';
	import { goto } from '$app/navigation';
	import { registration } from '$lib/stores/registration.svelte.js';

	let password = $state('');
	let confirmPassword = $state('');

	const isBusiness = registration.role === 'business';

	function handleSignUp() {
		if (!registration.email || !password || !confirmPassword) {
			alert('Please fill in all fields.');
			return;
		}
		if (password !== confirmPassword) {
			alert('Passwords do not match.');
			return;
		}
		registration.password = password;
		goto('/account');
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl="/choose-role" />

	<!-- Page title -->
	<div class="shrink-0 px-8 pt-1.5 pb-3">
		<h1 class="m-0 text-[28px] font-normal text-brand-dark italic">Sign Up</h1>
		<!-- subtle role badge so the user knows which flow they're in -->
		<span
			class="mt-1 inline-block rounded-full px-3 py-0.5 text-xs text-white italic
             {isBusiness ? 'bg-brand-dark' : 'bg-brand-yellow'}"
		>
			{isBusiness ? 'Business' : 'Customer'}
		</span>
	</div>

	<!-- Form -->
	<div class="flex shrink-0 flex-col gap-2.5 px-8">
		<!-- Name -->
		<InputField placeholder="Name" bind:value={registration.name} />

		<!-- Email -->
		<InputField
			type="email"
			placeholder="Email Id or Username"
			bind:value={registration.email}
		/>

		<!-- Password -->
		<PasswordInput placeholder="Password" bind:value={password} />

		<!-- Confirm Password -->
		<PasswordInput
			placeholder="Confirm Password"
			bind:value={confirmPassword}
		/>
	</div>

	<!-- Social section -->
	<div class="flex shrink-0 flex-col items-center gap-2.5 px-8 pt-3">
		<div class="flex w-full items-center gap-4">
			<div class="h-px flex-1 bg-brand-gray"></div>
			<span class="text-base text-brand-gray-dark italic">OR</span>
			<div class="h-px flex-1 bg-brand-gray"></div>
		</div>

		<p class="m-0 text-lg text-brand-gray-dark italic">Sign Up using</p>

		<div class="flex items-center gap-3.5">
			<SocialLoginButton provider="google" />
		</div>
	</div>

	<!-- Create Account button -->
	<div class="flex shrink-0 justify-center px-8 pt-4">
		<PrimaryButton text="Create Account" onclick={handleSignUp} />
	</div>

	<!-- Bottom chat -->
	<div class="flex flex-1 items-end">
		<ChatButton />
	</div>
</div>
