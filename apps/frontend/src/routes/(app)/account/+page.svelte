<script>
	import { enhance } from '$app/forms';
	import LogoPreview from '$lib/components/LogoPreview.svelte';
	import Header from '$lib/components/Header.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/utils/routes.js';

	let { data } = $props();

	const user = $derived(data?.user ?? null);
	const role = $derived((user?.role ?? '').toLowerCase());
	const isBusiness = $derived(role === 'business');
	const customerProfile = $derived(user?.customer_profile ?? {});
	const businessProfile = $derived(user?.business_profile ?? {});

	// student seller vs proper restaurant
	const businessType = $derived(businessProfile.business_type ?? '');
	const isStudentSeller = $derived(businessType === 'student');

	// is the business ready to accept orders?
	const isLive = $derived(businessProfile?.is_live ?? false);

	// picture — business shows logo, customer shows profile picture
	const avatarUrl = $derived(
		isBusiness
			? (businessProfile.logo_url ?? null)
			: (customerProfile.profile_picture_url ?? null)
	);

	function valueOrDash(value) {
		return value === null || value === undefined || value === '' ? '—' : value;
	}

	// ── quick actions ────────────────────────────────────────────
	const quickActions = $derived(
		isBusiness
			? isStudentSeller
				? [
						{
							icon: 'order',
							label: "Today's Post",
							href: ROUTES.dashboard.today
						},
						{
							icon: 'history',
							label: 'Past Offerings',
							href: ROUTES.dashboard.history
						},
						{
							icon: 'bell',
							label: 'Notifications',
							href: ROUTES.notifications
						},
						{ icon: 'settings', label: 'Settings', href: ROUTES.settings }
					]
				: [
						{ icon: 'order', label: 'Orders', href: ROUTES.dashboard.orders },
						{
							icon: 'booking',
							label: 'Meal Slots',
							href: ROUTES.dashboard.slots
						},
						{
							icon: 'bell',
							label: 'Notifications',
							href: ROUTES.notifications
						},
						{ icon: 'settings', label: 'Settings', href: ROUTES.settings }
					]
			: [
					{ icon: 'heart', label: 'Favourites', href: ROUTES.favourites },
					{ icon: 'order', label: 'My Orders', href: ROUTES.orders },
					{ icon: 'card', label: 'Payment', href: ROUTES.payment },
					{ icon: 'settings', label: 'Settings', href: ROUTES.settings }
				]
	);

	// ── menu items ───────────────────────────────────────────────
	const menuItems = $derived(
		isBusiness
			? [
					{
						icon: 'about',
						label: 'Restaurant Profile',
						href: ROUTES.dashboard.profile
					},
					{
						icon: 'order',
						label: isStudentSeller ? 'My Offerings' : 'Manage Menu',
						href: ROUTES.dashboard.menu
					},
					{
						icon: 'history',
						label: 'Order History',
						href: ROUTES.dashboard.history
					},
					{
						icon: 'feedback',
						label: 'Ratings & Reviews',
						href: ROUTES.dashboard.reviews
					},
					{ icon: 'help-table', label: 'Support Center', href: ROUTES.support },
					{ icon: 'faq', label: 'FAQs', href: ROUTES.faq }
				]
			: [
					{ icon: 'order', label: 'My Orders', href: ROUTES.orders },
					{
						icon: 'history',
						label: 'Order History',
						href: ROUTES.orderHistory
					},
					{ icon: 'feedback', label: 'Write Feedback', href: ROUTES.feedback },
					{ icon: 'help-table', label: 'Help Center', href: ROUTES.support },
					{ icon: 'faq', label: 'FAQs', href: ROUTES.faq }
				]
	);

	// ── detail rows ──────────────────────────────────────────────
	const detailRows = $derived(
		isBusiness
			? [
					{
						label: 'Restaurant',
						value: valueOrDash(businessProfile.restaurant_name)
					},
					{
						label: 'Type',
						value: isStudentSeller ? 'Student Seller' : 'Restaurant'
					},
					{
						label: 'Cuisine',
						value: valueOrDash(businessProfile.cuisine_type)
					},
					{ label: 'Phone', value: valueOrDash(businessProfile.phone_number) },
					{ label: 'Location', value: valueOrDash(businessProfile.location) },
					{
						label: 'Pickup pts',
						value: valueOrDash(businessProfile.pickup_locations)
					}
				]
			: [
					{
						label: 'Student ID',
						value: valueOrDash(customerProfile.student_id)
					},
					{ label: 'Phone', value: valueOrDash(customerProfile.phone_number) },
					{ label: 'Gender', value: valueOrDash(customerProfile.gender) },
					{
						label: 'Default pickup',
						value: valueOrDash(customerProfile.default_pickup_location)
					}
				]
	);
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden
         bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header />

	{#if user}
		<!-- ── not live nudge (business only) ───────────────────── -->
		{#if isBusiness && !isLive}
			<div
				class="mx-8 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
			>
				<p class="text-[12px] font-semibold text-amber-700 italic">
					Your restaurant isn't live yet
				</p>
				<p class="mt-0.5 text-[11px] text-amber-600 italic">
					{isStudentSeller
						? 'Post your first daily offering to start receiving orders.'
						: 'Add a meal slot and at least one menu item to go live.'}
				</p>
				<button
					onclick={() =>
						goto(
							isStudentSeller ? ROUTES.dashboard.today : ROUTES.dashboard.slots
						)}
					class="mt-2 rounded-full bg-amber-400 px-3 py-1 text-[11px] text-white italic"
				>
					{isStudentSeller ? 'Post an offering' : 'Set up meal slots'}
				</button>
			</div>
		{/if}

		<!-- ── profile card ─────────────────────────────────────── -->
		<div
			class="mx-8 my-2 flex shrink-0 items-center justify-between
                rounded-[7px] bg-gray-50 px-4 py-3"
		>
			<div class="flex flex-col gap-0.75">
				<p class="m-0 text-[16px] font-normal text-brand-dark italic">
					{valueOrDash(user.name)}
				</p>
				<p class="m-0 text-[13px] text-brand-dark italic">
					{valueOrDash(user.email)}
				</p>
				<div class="flex items-center gap-1.5">
					<span
						class="inline-block rounded-full px-2 py-0.5 text-[10px] text-white italic
                   {isBusiness ? 'bg-brand-dark' : 'bg-brand-yellow'}"
					>
						{isBusiness
							? isStudentSeller
								? 'Student Seller'
								: 'Business Account'
							: 'Customer Account'}
					</span>
					<!-- live badge -->
					{#if isBusiness}
						<span
							class="inline-block rounded-full px-2 py-0.5 text-[10px] text-white italic
                     {isLive ? 'bg-green-500' : 'bg-gray-400'}"
						>
							{isLive ? 'Live' : 'Offline'}
						</span>
					{/if}
				</div>
				<button
					onclick={() => goto(ROUTES.account + '/edit')}
					class="mt-0.5 text-left font-abeezee text-sm text-brand-yellow italic
                 hover:underline"
				>
					Edit profile
				</button>
			</div>

			<button
				onclick={() => goto(ROUTES.account + '/picture')}
				class="relative h-12.25 w-12.25 shrink-0"
				title="Change photo"
			>
				<div
					class="absolute top-1.25 left-1.25 flex h-9.75 w-9.75 items-center
                 justify-center overflow-hidden rounded-full bg-gray-100"
				>
					{#if avatarUrl}
						<img
							src={avatarUrl}
							alt={user.name}
							class="h-full w-full object-cover"
						/>
					{:else}
						<Icon name="profile" width="32" height="38" />
					{/if}
				</div>
				<div
					class="absolute inset-0 rounded-full border-[0.75px] border-brand-gray-dark"
				></div>
				<div
					class="absolute right-0 bottom-0 flex h-4 w-4 items-center justify-center
                 rounded-full bg-brand-yellow shadow"
				>
					<Icon name="camera" width="8" height="8" color="white" />
				</div>
			</button>
		</div>

		<!-- ── quick actions ─────────────────────────────────────── -->
		<div class="mx-8 my-2 flex shrink-0 gap-2">
			{#each quickActions as action}
				<button
					type="button"
					onclick={() => goto(action.href)}
					class="flex h-17.5 flex-1 cursor-pointer flex-col items-center gap-1.5
                 rounded-[5px] border-none bg-gray-100 px-1 pt-2.5 pb-2
                 transition-all duration-200 hover:-translate-y-px hover:bg-gray-200"
				>
					<div class="flex h-7 items-center justify-center">
						<Icon name={action.icon} width="24" height="24" color="#757373" />
					</div>
					<span class="text-center text-[8px] text-brand-dark italic">
						{action.label}
					</span>
				</button>
			{/each}
		</div>

		<!-- ── detail rows ────────────────────────────────────────── -->
		<div
			class="mx-8 my-2 shrink-0 overflow-hidden rounded-[7px] border border-gray-100"
		>
			<div class="border-b border-gray-100 bg-gray-50 px-4 py-2">
				<p class="text-[11px] text-brand-gray italic">
					{isBusiness ? 'Restaurant details' : 'Profile details'}
				</p>
			</div>
			<div class="divide-y divide-gray-100">
				{#each detailRows as row}
					<div class="flex items-start justify-between gap-4 px-4 py-2.5">
						<span class="shrink-0 text-[12px] text-brand-gray italic"
							>{row.label}</span
						>
						<span class="text-right text-[12px] text-brand-dark italic"
							>{row.value}</span
						>
					</div>
				{/each}
			</div>
		</div>

		<!-- ── menu list ──────────────────────────────────────────── -->
		<div class="my-1 flex-1 overflow-y-auto px-8 pb-4">
			<p class="pb-1 text-[11px] text-brand-gray italic">Account & support</p>

			{#each menuItems as item}
				<button
					type="button"
					onclick={() => goto(item.href)}
					class="flex w-full cursor-pointer items-center gap-4 border-b border-gray-100
                 bg-transparent py-3.5 transition-all duration-150
                 hover:-mx-1 hover:rounded-md hover:bg-gray-200 hover:px-1"
				>
					<div class="flex w-6 shrink-0 items-center justify-center">
						<Icon name={item.icon} width="20" height="20" color="#BDBDBD" />
					</div>
					<span
						class="flex-1 text-left text-[15px] font-normal text-brand-dark italic"
					>
						{item.label}
					</span>
					<Icon name="forward-arrow" width="7" height="11" color="#BDBDBD" />
				</button>
			{/each}

			<!-- logout always last, needs a form -->
			<form method="POST" action="?/logout" use:enhance>
				<button
					type="submit"
					class="flex w-full cursor-pointer items-center gap-4 border-b border-gray-100
                 bg-transparent py-3.5 transition-all duration-150
                 hover:-mx-1 hover:rounded-md hover:bg-gray-200 hover:px-1"
				>
					<div class="flex w-6 shrink-0 items-center justify-center">
						<Icon name="logout" width="20" height="20" color="#BDBDBD" />
					</div>
					<span
						class="flex-1 text-left text-[15px] font-normal text-brand-dark italic"
					>
						Logout
					</span>
					<Icon name="forward-arrow" width="7" height="11" color="#BDBDBD" />
				</button>
			</form>
		</div>
	{:else}
		<div
			class="mx-8 my-4 rounded-[7px] border border-red-200 bg-red-50 px-4 py-3"
		>
			<p class="text-[12px] text-red-500 italic">
				Unable to load account data. Please
				<a href={ROUTES.signIn} class="underline">sign in again</a>.
			</p>
		</div>
	{/if}
</div>
