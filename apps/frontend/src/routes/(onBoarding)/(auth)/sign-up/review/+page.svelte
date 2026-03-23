<script>
	import LogoPreview from '$lib/components/LogoPreview.svelte';
	import { goto } from '$app/navigation';
	import { registration, reset } from '$lib/stores/registration.svelte.js';
	import { applyAction, enhance } from '$app/forms';
	import {
		BUSINESS_SIGNUP_STEPS,
		CUSTOMER_SIGNUP_STEPS
	} from '$lib/utils/constants.js';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import { toastStore } from '$lib/stores/toasts.svelte.js';
	import { ROUTES, reviewBackRoute } from '$lib/utils/routes.js';
	import Title from '$lib/components/ui/Title.svelte';
	import StepTracker from '$lib/components/StepTracker.svelte';
	import { onMount } from 'svelte';

	const isBusiness = $derived(registration.role === 'business');
	const backUrl = reviewBackRoute(registration.role);

	let isSubmitting = $state(false);
	let { form } = $props();

	onMount(() => {
		if (!registration.role) {
			toastStore.error('Something went wrong. Please start again.');
			goto(ROUTES.signUp.chooseRole);
		}
	});
	const logoPreview = $derived(
		registration.logo
			? URL.createObjectURL(registration.logo)
			: null || registration.profile_picture
				? URL.createObjectURL(registration.profile_picture)
				: null
	);
	let profilePicturePreview = $derived(
		registration.profile_picture
			? URL.createObjectURL(registration.profile_picture)
			: null
	);
	const steps =
		registration.role === 'business'
			? BUSINESS_SIGNUP_STEPS
			: CUSTOMER_SIGNUP_STEPS;

	const accountFields = $derived([
		{ label: 'Name', value: registration.name || '—' },
		{ label: 'Email', value: registration.email || '—' },
		{ label: 'Password', value: '••••••••' }
	]);

	const customerFields = $derived([
		{ label: 'Phone', value: registration.phone_number || '—' },
		{ label: 'Gender', value: registration.gender || '—' },
		{
			label: 'Pickup location',
			value: registration.default_pickup_location || '—'
		},
		{
			label: 'Profile picture',
			value: registration.profile_picture
				? registration.profile_picture.name
				: '—'
		}
	]);

	const businessFields = $derived([
		{ label: 'Restaurant', value: registration.restaurant_name || '—' },
		{ label: 'Location', value: registration.location || '—' },
		{ label: 'Business type', value: registration.business_type || '—' },
		{ label: 'Phone', value: registration.phone_number || '—' },
		{ label: 'Cuisine', value: registration.cuisine_type || '—' },
		{ label: 'SSM number', value: registration.ssm_registration || '—' },
		{ label: 'Description', value: registration.description || '—' },
		{ label: 'Pickup points', value: registration.pickup_locations || '—' }
	]);
</script>

{#snippet sectionHeader(title)}
	<div class="border-b border-[#E8E8E8] bg-[#F6F6F6] px-4 py-2">
		<p
			class="text-xs font-semibold tracking-wide text-brand-gray uppercase italic"
		>
			{title}
		</p>
	</div>
{/snippet}

{#snippet reviewRow(label, value)}
	<div class="flex items-start justify-between gap-4 px-4 py-2.5">
		<span class="shrink-0 text-sm text-brand-gray italic">{label}</span>
		<span class="text-right text-sm break-all text-brand-dark italic"
			>{value}</span
		>
	</div>
{/snippet}

<div class="flex h-full flex-col bg-white">

	<div class="shrink-0 px-8 pt-1.5 pb-3">
		<Title size="medium">Review</Title>
		<span
			class="mt-1 inline-block rounded-full px-3 py-0.5 text-xs text-white italic
             {isBusiness ? 'bg-brand-dark' : 'bg-brand-yellow'}"
		>
			{isBusiness ? 'Business' : 'Customer'}
		</span>
	</div>

	<StepTracker {steps} currentStep={steps.length - 1} />

	<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-8 pb-4">
		<div class="overflow-hidden rounded-lg border border-[#E8E8E8]">
			{@render sectionHeader('Account')}
			<div class="divide-y divide-[#F6F6F6]">
				{#each accountFields as field}
					{@render reviewRow(field.label, field.value)}
				{/each}
			</div>
		</div>

		{#if isBusiness}
			{#if logoPreview}
				<LogoPreview previewUrl={logoPreview} Deleteable={false} />
			{/if}

			<div class="overflow-hidden rounded-lg border border-[#E8E8E8]">
				{@render sectionHeader('Business Details')}
				<div class="divide-y divide-[#F6F6F6]">
					{#each businessFields as field}
						{@render reviewRow(field.label, field.value)}
					{/each}
				</div>
			</div>
		{:else}
        {#if profilePicturePreview}
            <LogoPreview previewUrl={profilePicturePreview} Deleteable={false} />
        {/if}
			<div class="overflow-hidden rounded-lg border border-[#E8E8E8]">
				{@render sectionHeader('customer Profile')}
				<div class="divide-y divide-[#F6F6F6]">
					{#each customerFields as field}
						{@render reviewRow(field.label, field.value)}
					{/each}
				</div>
			</div>
		{/if}

		<div class="flex flex-col gap-1 rounded-lg bg-[#F6F6F6] px-4 py-3">
			<p class="mb-1 text-xs text-brand-gray italic">
				Need to change something?
			</p>
			<button
				class="text-left text-sm text-brand-yellow italic underline-offset-2
               hover:underline"
				onclick={() => goto(ROUTES.signUp.account)}
			>
				Edit account details
			</button>
			{#if isBusiness}
				<button
					class="text-left text-sm text-brand-yellow italic underline-offset-2
                 hover:underline"
					onclick={() => goto(ROUTES.signUp.business.details)}
				>
					Edit business details
				</button>
				<button
					class="text-left text-sm text-brand-yellow italic underline-offset-2
                 hover:underline"
					onclick={() => goto(ROUTES.signUp.business.setup)}
				>
					Edit restaurant setup
				</button>
			{:else}
				<button
					class="text-left text-sm text-brand-yellow italic underline-offset-2
                 hover:underline"
					onclick={() => goto(ROUTES.signUp.customer.profile)}
				>
					Edit customer profile
				</button>
			{/if}
			{#if form?.errors && Object.keys(form.errors).length > 0 && !form.errors.server}
				<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
					<p class="mb-2 text-xs font-semibold text-red-500 italic">
						Please fix the following:
					</p>
					{#each Object.entries(form.errors) as [field, message]}
						<p class="text-xs text-red-400 italic">
							<span class="capitalize">{field.replace(/_/g, ' ')}</span>: {message}
						</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	{#if form?.errors?.server}
		<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
			<p class="text-sm text-red-500 italic">{form.errors.server}</p>
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={({ formData }) => {
			if (registration.logo) formData.set('logo', registration.logo);
			if (registration.profile_picture) formData.set('profile_picture', registration.profile_picture);
			isSubmitting = true;
			return async ({ result, update }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toastStore.success('Account created! Welcome to Swift Meals 🎉');
					reset();
					await applyAction(result);
					return;
				}
				await update();
			};
		}}
		class="shrink-0 px-8 pt-2 pb-2"
	>
		<input type="hidden" name="role" value={registration.role} />
		<input
			type="hidden"
			name="phone_number"
			value={registration.phone_number}
		/>
		{#if !isBusiness}
			<input type="hidden" name="gender" value={registration.gender} />
			<input
				type="hidden"
				name="default_pickup_location"
				value={registration.default_pickup_location}
			/>
			<input type="file" name="profile_picture" class="hidden" />
		{:else}
			<input
				type="hidden"
				name="restaurant_name"
				value={registration.restaurant_name}
			/>
			<input type="hidden" name="location" value={registration.location} />

			<input
				type="hidden"
				name="business_type"
				value={registration.business_type}
			/>
			<input
				type="hidden"
				name="cuisine_type"
				value={registration.cuisine_type}
			/>
			<input
				type="hidden"
				name="ssm_registration"
				value={registration.ssm_registration}
			/>
			<input
				type="hidden"
				name="description"
				value={registration.description}
			/>
			<input
				type="hidden"
				name="pickup_locations"
				value={registration.pickup_locations}
			/>
			<input type="file" name="logo" class="hidden" />
		{/if}

		<div class="shrink-0 px-8 pt-2 pb-10">
			<PrimaryButton
				type="submit"
				text={isSubmitting ? 'Creating profile...' : 'Confirm & Create Account'}
				disabled={isSubmitting}
				loading={isSubmitting}
			/>
		</div>
	</form>
</div>
