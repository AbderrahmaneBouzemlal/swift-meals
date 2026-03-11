<script>
	import Header from './Header.svelte';
	import ChatButton from './ui/ChatButton.svelte';
	import SocialLoginButton from './ui/SocialLoginButton.svelte';
	import InputField from './ui/InputField.svelte';
	import PasswordInput from './ui/PasswordInput.svelte';
	import Icon from './ui/Icon.svelte';
	import PrimaryButton from './ui/PrimaryButton.svelte';
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let agreeToOffers = false;

	function handleSignUp() {
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
	</div>

	<!-- Form -->
	<div class="flex shrink-0 flex-col gap-2.5 px-8">
		<!-- Name -->
		<InputField placeholder="Name" bind:value={name} />

		<!-- Email -->
		<InputField
			type="email"
			placeholder="Email Id or Username"
			bind:value={email}
		/>

		<!-- Password -->
		<PasswordInput placeholder="Password" bind:value={password} />

		<!-- Confirm Password -->
		<PasswordInput
			placeholder="Confirm Password"
			bind:value={confirmPassword}
		/>

		<!-- Checkbox -->
		<div
			class="flex cursor-pointer items-start gap-2.5 pt-1"
			onclick={() => (agreeToOffers = !agreeToOffers)}
			tabindex="-1"
			role="presentation"
			onkeydown={(e) => e.key === ' ' && (agreeToOffers = !agreeToOffers)}
		>
			<div
				class="mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-[3px] border-[0.75px] border-brand-gray bg-white transition-all duration-200 outline-none {agreeToOffers
					? 'border-brand-yellow bg-brand-yellow'
					: ''}"
				role="checkbox"
				aria-checked={agreeToOffers}
				tabindex="0"
			>
				{#if agreeToOffers}
					<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
						<path
							d="M1 4L3.5 6.5L9 1"
							stroke="white"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</div>
			<span class="text-[13px] leading-snug text-brand-gray-dark italic"
				>Yes, I want to receive discounts, loyalty offers and other updates.</span
			>
		</div>
	</div>

	<!-- Social section -->
	<div class="flex shrink-0 flex-col items-center gap-2.5 px-8 pt-3">
		<div class="flex w-full items-center gap-4">
			<div class="h-px flex-1 bg-brand-gray"></div>
			<span class="text-base text-brand-gray-dark italic">OR</span>
			<div class="h-px flex-1 bg-brand-gray"></div>
		</div>

		<p class="m-0 text-[18px] text-brand-gray-dark italic">Sign Up using</p>

		<div class="flex items-center gap-3.5">
			<SocialLoginButton provider="apple" />
			<SocialLoginButton provider="google" />
			<SocialLoginButton provider="facebook" />
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
