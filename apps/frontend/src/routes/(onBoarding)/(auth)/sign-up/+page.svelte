<script>
	import { applyAction, enhance } from '$app/forms';
	import SocialLoginButton from '$lib/components/ui/SocialLoginButton.svelte';
	import InputField from '$lib/components/ui/InputField.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { registration } from '$lib/stores/registration.svelte.js';
	import { useFormValidation } from '$lib/hooks/useFormValidation.svelte.js';
	import StepTracker from '$lib/components/StepTracker.svelte';
	import { accountSchema } from '$lib/validation/schemas';
	import { toastStore } from '$lib/stores/toasts.svelte.js';

	let { form } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let isSubmitting = $state(false);

	const schemaForm = useFormValidation(accountSchema, () => ({
		name: registration.name,
		email: registration.email,
		password,
		confirmPassword
	}));

	const errors = $derived({ ...schemaForm.errors, ...form?.errors });

	// Generic signup steps shown before role selection
	const steps = $derived(['Account', 'Choose Role', 'Profile/Details']);

	function handleSignUp(event) {
		if (
			!schemaForm.submitValidate([
				'name',
				'email',
				'password',
				'confirmPassword'
			])
		) {
			event.cancel();
			return;
		}

		isSubmitting = true;

		return async ({ update, result }) => {
			isSubmitting = false;
			if (result.type === 'failure') {
				toastStore.error(
					result.data?.errors?.server || 'An error occurred. Please try again.'
				);
				console.error('Signup error:', result.data);
			}
			if (result.type === 'redirect') {
				await applyAction(result);
				return;
			}
			await update();
		};
	}
</script>

<div class="flex h-full flex-col bg-white">
	<div
		class="flex shrink-0 flex-col items-center justify-center gap-2 px-8 pt-1.5 pb-8"
	>
		<Title size="medium">Sign Up</Title>
	</div>

	<StepTracker {steps} currentStep={0} />

	<form
		method="POST"
		use:enhance={handleSignUp}
		class="flex shrink-0 flex-col gap-2.5 px-8"
	>
		<InputField
			name="name"
			placeholder={'Full name'}
			bind:value={registration.name}
			error={errors.name}
			onblur={() => schemaForm.touch('name')}
		/>

		<InputField
			name="email"
			type="email"
			placeholder="Email address"
			bind:value={registration.email}
			error={errors.email}
			onblur={() => schemaForm.touch('email')}
		/>

		<InputField
			name="password"
			placeholder="Password"
			type="password"
			bind:value={password}
			error={errors.password}
			onblur={() => schemaForm.touch('password')}
		/>

		<InputField
			name="confirmPassword"
			placeholder="Confirm Password"
			type="password"
			bind:value={confirmPassword}
			error={errors.confirmPassword}
			onblur={() => schemaForm.touch('confirmPassword')}
		/>

		<div class="flex shrink-0 flex-col items-center gap-2.5 px-8 pt-3">
			<div class="flex w-full items-center gap-4">
				<div class="h-px flex-1 bg-brand-gray"></div>
				<span class="text-base text-brand-gray-dark italic">OR</span>
				<div class="h-px flex-1 bg-brand-gray"></div>
			</div>

			<p class="m-0 text-lg text-brand-gray-dark italic">Continue with</p>

			<div class="flex items-center gap-3.5">
				<SocialLoginButton provider="google" />
			</div>
		</div>

		<div class="shrink-0 px-8 pt-4">
			<PrimaryButton
				type="submit"
				text={isSubmitting ? 'Creating account...' : 'Create Account'}
				loading={isSubmitting}
			/>
		</div>
	</form>
</div>
