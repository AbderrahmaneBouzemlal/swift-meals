<script>
	import Header from '$lib/components/Header.svelte';
	import ChatButton from '$lib/components/ui/ChatButton.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import Title from '$lib/components/ui/Title.svelte';
	import { goto } from '$app/navigation';
	import { registration, reset } from '$lib/stores/registration.svelte.js';
	import {
		BUSINESS_SIGNUP_STEPS,
		CUSTOMER_SIGNUP_STEPS
	} from '$lib/utils/constants';
	import StepTracker from '$lib/components/StepTracker.svelte';

	const isBusiness = $derived(registration.role === 'business');

	const backUrl = $derived(
		isBusiness ? '/sign-up/business/setup' : '/sign-up/customer/profile'
	);

	const steps = $derived(
		isBusiness ? BUSINESS_SIGNUP_STEPS : CUSTOMER_SIGNUP_STEPS
	);

	const logoPreview = $derived(
		registration.logo ? URL.createObjectURL(registration.logo) : null
	);

	let isSubmitting = $state(false);
	let serverError = $state('');

	const accountFields = $derived([
		{ label: 'Name', value: registration.name },
		{ label: 'Email', value: registration.email },
		{ label: 'Password', value: '••••••••' }
	]);

	const customerFields = $derived([
		{ label: 'Student ID', value: registration.student_id || '—' },
		{ label: 'Phone', value: registration.phone_number || '—' },
		{ label: 'Gender', value: registration.gender || '—' },
		{
			label: 'Pickup location',
			value: registration.default_pickup_location || '—'
		}
	]);

	const businessFields = $derived([
		{ label: 'Restaurant', value: registration.restaurant_name || '—' },
		{ label: 'Location', value: registration.location || '—' },
		{ label: 'Phone', value: registration.phone_number || '—' },
		{ label: 'Cuisine', value: registration.cuisine_type || '—' },
		{ label: 'SSM number', value: registration.ssm_registration || '—' },
		{ label: 'Description', value: registration.description || '—' },
		{ label: 'Pickup points', value: registration.pickup_locations || '—' }
	]);

	async function registerUser() {
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: registration.email,
				name: registration.name,
				password: registration.password,
				role: isBusiness ? 'RESTAURANT' : 'STUDENT'
			})
		});
		if (!res.ok) {
			const data = await res.json();
			throw new Error(data?.detail ?? 'Registration failed');
		}
		return res.json();
	}

	async function registerCustomerProfile(token) {
		const res = await fetch('/api/student/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				student_id: registration.student_id,
				phone_number: registration.phone_number,
				gender: registration.gender,
				default_pickup_location: registration.default_pickup_location
			})
		});
		if (!res.ok) throw new Error('Failed to save student profile');
	}

	async function registerBusinessProfile(token) {
		const form = new FormData();
		form.append('restaurant_name', registration.restaurant_name);
		form.append('location', registration.location);
		form.append('phone_number', registration.phone_number);
		form.append('cuisine_type', registration.cuisine_type);
		form.append('ssm_registration', registration.ssm_registration);
		form.append('description', registration.description);
		form.append('pickup_locations', registration.pickup_locations);
		if (registration.logo) form.append('logo', registration.logo);

		const res = await fetch('/api/restaurant/profile', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
			body: form
		});
		if (!res.ok) throw new Error('Failed to save restaurant profile');
	}

	async function handleSubmit() {
		isSubmitting = true;
		serverError = '';
		try {
			const { token } = await registerUser();
			if (isBusiness) {
				await registerBusinessProfile(token);
			} else {
				await registerCustomerProfile(token);
			}
			reset();
			goto('/account');
		} catch (err) {
			serverError = err.message;
		} finally {
			isSubmitting = false;
		}
	}
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

<!-- ── markup ─────────────────────────────────────────────────── -->

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden
         bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header {backUrl} />

	<!-- Title -->
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

	<!-- Summary cards -->
	<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-8 pb-4">
		<!-- Account — same for both roles -->
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
				<div
					class="flex items-center gap-3 rounded-lg border border-[#E8E8E8]
                    bg-[#F6F6F6] p-3"
				>
					<img
						src={logoPreview}
						alt="Restaurant logo"
						class="h-14 w-14 rounded-lg object-cover shadow-sm"
					/>
					<div>
						<p class="text-xs text-brand-gray italic">Restaurant Logo</p>
						<p class="truncate text-sm text-brand-dark italic">
							{registration.logo?.name}
						</p>
					</div>
				</div>
			{/if}

			<!-- Business details -->
			<div class="overflow-hidden rounded-lg border border-[#E8E8E8]">
				{@render sectionHeader('Business Details')}
				<div class="divide-y divide-[#F6F6F6]">
					{#each businessFields as field}
						{@render reviewRow(field.label, field.value)}
					{/each}
				</div>
			</div>
		{:else}
			<div class="overflow-hidden rounded-lg border border-[#E8E8E8]">
				{@render sectionHeader('Student Profile')}
				<div class="divide-y divide-[#F6F6F6]">
					{#each customerFields as field}
						{@render reviewRow(field.label, field.value)}
					{/each}
				</div>
			</div>
		{/if}

		<!-- Edit links -->
		<div class="flex flex-col gap-1 rounded-lg bg-[#F6F6F6] px-4 py-3">
			<p class="mb-1 text-xs text-brand-gray italic">
				Need to change something?
			</p>
			<button
				class="text-left text-sm text-brand-yellow italic underline-offset-2
               hover:underline"
				onclick={() => goto('/sign-up')}
			>
				Edit account details
			</button>
			{#if isBusiness}
				<button
					class="text-left text-sm text-brand-yellow italic underline-offset-2
                 hover:underline"
					onclick={() => goto('/sign-up/business/details')}
				>
					Edit business details
				</button>
				<button
					class="text-left text-sm text-brand-yellow italic underline-offset-2
                 hover:underline"
					onclick={() => goto('/sign-up/business/setup')}
				>
					Edit restaurant setup
				</button>
			{:else}
				<button
					class="text-left text-sm text-brand-yellow italic underline-offset-2
                 hover:underline"
					onclick={() => goto('/sign-up/customer/profile')}
				>
					Edit student profile
				</button>
			{/if}
		</div>

		<!-- Server error -->
		{#if serverError}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
				<p class="text-sm text-red-500 italic">{serverError}</p>
			</div>
		{/if}
	</div>

	<!-- CTA -->
	<div class="shrink-0 px-8 pt-2 pb-2">
		<PrimaryButton
			text={isSubmitting ? 'Creating account...' : 'Confirm & Create Account'}
			onclick={handleSubmit}
			disabled={isSubmitting}
		/>
	</div>

	<div class="flex shrink-0 items-end">
		<ChatButton />
	</div>
</div>
