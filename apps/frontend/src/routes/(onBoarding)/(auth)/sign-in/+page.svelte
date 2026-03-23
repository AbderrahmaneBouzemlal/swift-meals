<script>
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import SocialLoginButton from '$lib/components/ui/SocialLoginButton.svelte';
	import InputField from '$lib/components/ui/InputField.svelte';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { signInSchema } from '$lib/utils/schemas';
	import { useFormValidation } from '$lib/utils/useFormValidation.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
	import { applyAction, enhance } from '$app/forms';
	import { toastStore } from '$lib/stores/toasts.svelte.js';
	import AuthLayout from '$lib/components/layout/AuthLayout.svelte';

	let { form } = $props();

	let email = $state('');
	let password = $state('');
	let isSigningIn = $state(false);

	const schemaForm = useFormValidation(signInSchema, () => ({
		email,
		password
	}));

	let errors = $derived({ ...schemaForm.errors, ...form?.errors });

	function handleSignIn(event) {
		if (!schemaForm.submitValidate(['email', 'password'])) {
			event.cancel();
			return;
		}

		isSigningIn = true;

		return async ({ update, result }) => {
			isSigningIn = false;
			if (result.type === 'failure') {
				toastStore.error(result.data?.errors?.server || 'Invalid credentials');
			}
			if (result.type === 'redirect') {
				await applyAction(result);
				return;
			}
			await update();
		};
	}
</script>

<AuthLayout>
	<div class="lg:hidden">
		<Header backUrl={ROUTES.home} />
	</div>

	<div class="flex shrink-0 items-center justify-center px-8 pt-2 pb-8">
		<Title size="medium">Sign In</Title>
	</div>

	<form
		method="POST"
		use:enhance={handleSignIn}
		class="flex shrink-0 flex-col gap-3 px-8"
	>
		<InputField
			name="email"
			type="email"
			placeholder="Email"
			bind:value={email}
			error={errors.email}
			onblur={() => schemaForm.touch('email')}
			icon="mail"
		/>

		<PasswordInput
			name="password"
			placeholder="Password"
			bind:value={password}
			error={errors.password}
			onblur={() => schemaForm.touch('password')}
		/>

		<button
			type="button"
			class="cursor-pointer border-none bg-transparent p-0 text-left font-abeezee text-[12px] text-brand-gray italic transition-colors duration-200 hover:text-brand-yellow"
			>Forgot your password?</button
		>

		<div class="flex shrink-0 justify-center py-5">
			<PrimaryButton
				type="submit"
				text="Sign In"
				loading={isSigningIn}
				disabled={isSigningIn}
			/>
		</div>
	</form>

	<div class="flex shrink-0 flex-col items-center gap-3 px-8">
		<div class="flex w-full items-center gap-4">
			<div class="h-px flex-1 bg-brand-gray"></div>
			<span class="text-base text-brand-gray-dark italic">OR</span>
			<div class="h-px flex-1 bg-brand-gray"></div>
		</div>

		<p class="m-0 text-lg text-brand-gray-dark italic">Sign In using</p>

		<div class="flex items-center justify-center gap-4">
			<SocialLoginButton provider="google" />
		</div>
	</div>

	<!-- Bottom: Need an account -->
	<div class="mt-auto flex items-center justify-center gap-2 pt-8">
		<span class="text-sm text-brand-gray-dark italic">Need An Account?</span>
		<button
			class="cursor-pointer border-none bg-transparent p-0 font-abeezee text-sm font-semibold
                 text-brand-yellow italic transition-opacity duration-200 hover:opacity-80"
			onclick={() => goto(ROUTES.signUp.account)}>Sign Up</button
		>
	</div>
</AuthLayout>
