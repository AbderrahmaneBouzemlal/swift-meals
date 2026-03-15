<script>
	import LogoPreview from './../../../../../lib/components/LogoPreview.svelte';
	import { goto } from '$app/navigation';
	import { registration, reset } from '$lib/stores/registration.svelte.js';
	import {
		registerCustomer,
		registerBusiness
	} from '$lib/utils/registration.js';
	import { ApiError } from '$lib/utils/api.js';
	import { toastStore } from '$lib/stores/toasts.svelte.js';
	import { ROUTES, reviewBackRoute } from '$lib/utils/routes.js';

	const isBusiness = $derived(registration.role === 'business');
	const backUrl = $derived(reviewBackRoute(registration.role));

	let isSubmitting = $state(false);
	let fieldErrors = $state({});

	async function handleSubmit() {
		isSubmitting = true;
		fieldErrors = {};

		try {
			const register = isBusiness ? registerBusiness : registerCustomer;
			await register(registration);

			toastStore.success('Account created! Welcome to Swift Meals 🎉');
			reset();
			goto(ROUTES.account);
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.type === 'validation') {
					fieldErrors = err.fieldErrors;
				} else {
					toastStore.error(err.message);
				}
			} else {
				toastStore.error('Something unexpected happened.');
			}
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
				<LogoPreview previewUrl={logoPreview} Deleteable={false} />
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
					onclick={() => goto('ROUTES.signUp.customer.profile')}
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
			loading={isSubmitting}
		/>
	</div>
</div>
