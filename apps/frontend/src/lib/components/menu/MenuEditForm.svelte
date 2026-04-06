<script>
	import { enhance } from '$app/forms';
	import { beforeNavigate, goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let { menu = $bindable(), isSubmitting = false } = $props();

	let initialName = menu.name ?? '';
	let initialDescription = menu.description ?? '';
	let initialIsActive = Boolean(menu.is_active);

	let name = $state(initialName);
	let description = $state(initialDescription);
	let isActive = $state(initialIsActive);

	let isSaving = $state(false);
	let showLeavePrompt = $state(false);
	let pendingNavigationHref = $state('');
	let allowNextNavigation = $state(false);
	let formElement;

	const hasUnsavedChanges = $derived(
		name !== initialName ||
			description !== initialDescription ||
			isActive !== initialIsActive
	);

	function toggleActive() {
		isActive = !isActive;
	}

	function resetSavedState() {
		initialName = name;
		initialDescription = description;
		initialIsActive = isActive;
	}

	function closeLeavePrompt() {
		showLeavePrompt = false;
		pendingNavigationHref = '';
	}

	function promptLeave(navigation) {
		pendingNavigationHref = navigation.to?.url?.href ?? '';
		showLeavePrompt = true;
	}

	async function saveAndContinue() {
		if (!formElement) return;

		formElement.requestSubmit();
	}
	async function leaveWithoutSaving() {
		const targetHref = pendingNavigationHref;
		closeLeavePrompt();

		if (targetHref) {
			allowNextNavigation = true;
			await goto(targetHref);
		}
	}

	function handleBeforeUnload(event) {
		if (!hasUnsavedChanges || isSaving) return;

		event.preventDefault();
		event.returnValue = '';
	}

	function handleSubmit() {
		isSaving = true;
	}

	onMount(() => {
		window.addEventListener('beforeunload', handleBeforeUnload);
		beforeNavigate((navigation) => {
			if (allowNextNavigation) {
				allowNextNavigation = false;
				return;
			}

			if (!hasUnsavedChanges || isSaving || navigation.willUnload) return;

			navigation.cancel();
			promptLeave(navigation);
		});

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	onDestroy(() => {
		menu.name = name;
		menu.description = description;
		menu.is_active = isActive;
	});
</script>

<form
	method="POST"
	action="?/updateMenu"
	bind:this={formElement}
	use:enhance={() => {
		handleSubmit();
		return async ({ result }) => {
			isSaving = false;

			if (result.type === 'success') {
				resetSavedState();
				const targetHref = pendingNavigationHref;
				closeLeavePrompt();

				if (targetHref) {
					allowNextNavigation = true;
					await goto(targetHref);
				}
			}
		};
	}}
	class="flex flex-col gap-3"
>
	<div class="flex flex-col gap-1">
		<label class="text-sm text-brand-gray italic" for="menu-name">
			Menu name
		</label>
		<input
			id="menu-name"
			name="name"
			bind:value={name}
			class="h-10 w-full rounded-lg border border-gray-100 bg-gray-50
             px-3 font-abeezee text-[14px] text-brand-dark italic
             outline-none focus:border-brand-yellow focus:bg-white"
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label class="text-sm text-brand-gray italic" for="menu-desc">
			Description
		</label>
		<textarea
			id="menu-desc"
			name="description"
			bind:value={description}
			class="min-h-16 w-full rounded-lg border border-gray-100 bg-gray-50
             p-3 font-abeezee text-[14px] text-brand-dark italic
             outline-none focus:border-brand-yellow focus:bg-white"
		></textarea>
	</div>

	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={toggleActive}
				class="flex h-6 w-10 items-center rounded-full transition-colors
				 {isActive ? 'bg-brand-yellow' : 'bg-gray-200'}"
				aria-pressed={isActive}
				aria-label="Toggle menu active state"
			>
				<span
					class="h-4 w-4 rounded-full bg-white shadow transition-transform
					 {isActive ? 'translate-x-5' : 'translate-x-1'}"
				></span>
			</button>
			<span class="text-sm text-brand-gray italic">Active</span>
			<input type="hidden" name="is_active" value={isActive} />
		</div>

		<button
			type="submit"
			disabled={isSubmitting || isSaving}
			class="bg-yellow-50 text-sm font-bold text-brand-yellow italic
             transition-transform active:scale-95 disabled:opacity-50"
		>
			{isSubmitting || isSaving ? 'Saving…' : 'Save changes'}
		</button>
	</div>
</form>

{#if showLeavePrompt}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
	>
		<div
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="unsaved-title"
			aria-describedby="unsaved-description"
			class="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
		>
			<div class="space-y-2">
				<p
					class="text-xs font-bold tracking-[0.2em] text-brand-yellow uppercase"
				>
					Unsaved changes
				</p>
				<h2 id="unsaved-title" class="text-xl font-bold text-brand-dark">
					Save before leaving?
				</h2>
				<p id="unsaved-description" class="text-sm leading-6 text-brand-gray">
					You have changes that haven’t been saved yet. Save them now, or keep
					going and leave without saving.
				</p>
			</div>

			<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
				<button
					type="button"
					onclick={leaveWithoutSaving}
					class="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-brand-gray transition-colors hover:bg-gray-50"
				>
					Keep going without saving
				</button>
				<button
					type="button"
					onclick={saveAndContinue}
					disabled={isSaving || isSubmitting}
					class="rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
				>
					Save changes
				</button>
			</div>
		</div>
	</div>
{/if}
