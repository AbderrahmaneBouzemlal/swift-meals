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
					{ label: 'Phone', value: valueOrDash(customerProfile.phone_number) },
					{ label: 'Gender', value: valueOrDash(customerProfile.gender) },
					{
						label: 'Default pickup',
						value: valueOrDash(customerProfile.default_pickup_location)
					}
				]
	);
</script>

<div class="flex h-full flex-col bg-white">

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

		<div
			class="mx-8 my-4 flex shrink-0 flex-col items-center justify-between gap-6
                rounded-2xl bg-gray-50 px-8 py-6 lg:flex-row lg:items-center"
		>
			<div class="flex flex-col items-center gap-4 lg:flex-row lg:gap-8">
				<button
					onclick={() => goto(ROUTES.account + '/picture')}
					class="relative h-24 w-24 shrink-0 transition-transform hover:scale-105"
					title="Change photo"
				>
					<div
						class="absolute top-2 left-2 flex h-20 w-20 items-center
                     justify-center overflow-hidden rounded-full bg-white shadow-sm"
					>
						{#if avatarUrl}
							<img
								src={avatarUrl}
								alt={user.name}
								class="h-full w-full object-cover"
							/>
						{:else}
							<Icon name="profile" width="48" height="56" />
						{/if}
					</div>
					<div
						class="absolute inset-0 rounded-full border-2 border-brand-yellow/20"
					></div>
					<div
						class="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center
                     rounded-full bg-brand-yellow shadow-lg transition-transform active:scale-90"
					>
						<Icon name="camera" width="16" height="16" color="white" />
					</div>
				</button>

				<div class="flex flex-col items-center gap-1 lg:items-start">
					<p class="m-0 text-2xl font-bold text-brand-dark italic">
						{valueOrDash(user.name)}
					</p>
					<p class="m-0 text-brand-gray-dark italic">
						{valueOrDash(user.email)}
					</p>
					<div class="mt-2 flex items-center gap-2">
						<span
							class="inline-block rounded-full px-3 py-1 text-xs font-medium text-white italic
                       {isBusiness ? 'bg-brand-dark' : 'bg-brand-yellow'}"
						>
							{isBusiness
								? isStudentSeller
									? 'Student Seller'
									: 'Business Account'
								: 'Customer Account'}
						</span>
						{#if isBusiness}
							<span
								class="inline-block rounded-full px-3 py-1 text-xs font-medium text-white italic
                         {isLive ? 'bg-green-500' : 'bg-gray-400'}"
							>
								{isLive ? 'Live' : 'Offline'}
							</span>
						{/if}
					</div>
				</div>
			</div>

			<button
				onclick={() => goto(ROUTES.account + '/edit')}
				class="rounded-xl border border-brand-yellow px-6 py-2.5 font-abeezee text-sm font-bold text-brand-yellow italic transition-all hover:bg-brand-yellow hover:text-white"
			>
				Edit profile
			</button>
		</div>

		<!-- ── quick actions ─────────────────────────────────────── -->
		<div class="mx-8 my-4 grid shrink-0 grid-cols-2 gap-4 lg:grid-cols-4">
			{#each quickActions as action}
				<button
					type="button"
					onclick={() => goto(action.href)}
					class="flex flex-col items-center gap-3
                 rounded-2xl border border-gray-100 bg-white p-6
                 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-yellow hover:shadow-md"
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
						<Icon name={action.icon} width="28" height="28" color="#757373" />
					</div>
					<span class="text-center text-sm font-medium text-brand-dark italic">
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
			<div class="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
				{#each detailRows as row}
					<div class="flex items-center justify-between gap-4 px-6 py-4">
						<span class="shrink-0 text-sm text-brand-gray-dark italic"
							>{row.label}</span
						>
						<span class="font-medium text-brand-dark italic"
							>{row.value}</span
						>
					</div>
				{/each}
			</div>
		</div>

		<!-- ── menu list ──────────────────────────────────────────── -->
		<div class="my-6 flex-1 overflow-y-auto px-8 pb-8">
			<p class="mb-4 text-xs font-bold text-brand-gray uppercase tracking-wider italic">Account & support</p>

			<div class="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-x-8">

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
						class="group flex w-full cursor-pointer items-center gap-4 rounded-xl border border-transparent
                 bg-transparent px-4 py-4 transition-all duration-200
                 hover:bg-red-50"
					>
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-red-100">
							<Icon name="logout" width="20" height="20" color="#BDBDBD" />
						</div>
						<span
							class="flex-1 text-left text-base font-medium text-brand-dark italic group-hover:text-red-500"
						>
							Logout
						</span>
						<Icon name="forward-arrow" width="7" height="11" color="#BDBDBD" />
					</button>
				</form>
			</div>
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
