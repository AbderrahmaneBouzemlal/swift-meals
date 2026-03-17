<script>
	import Header from '$lib/components/Header.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data } = $props();
	const user = $derived(data?.user || null);

	const role = $derived((user?.role || '').toLowerCase());
	const isBusiness = $derived(role === 'business');

	const customerProfile = $derived(user?.customer_profile || {});
	const restaurantProfile = $derived(user?.business_profile || {});

	const quickActions = $derived(
		isBusiness
			? [
					{ icon: 'order', label: 'Incoming Orders' },
					{ icon: 'booking', label: 'Pickup Schedule' },
					{ icon: 'bell', label: 'Notifications' },
					{ icon: 'settings', label: 'Restaurant Settings' }
				]
			: [
					{ icon: 'heart', label: 'Favorites' },
					{ icon: 'order', label: 'My Orders' },
					{ icon: 'card', label: 'Payment' },
					{ icon: 'settings', label: 'Settings' }
				]
	);

	const accountMenuItems = $derived(
		isBusiness
			? [
					{ icon: 'about', label: 'Restaurant Profile' },
					{ icon: 'history', label: 'Order History' },
					{ icon: 'feedback', label: 'Ratings & Reviews' },
					{ icon: 'help-table', label: 'Support Center' },
					{ icon: 'faq', label: 'FAQs' },
					{ icon: 'logout', label: 'Logout' }
				]
			: [
					{ icon: 'order', label: 'My Orders' },
					{ icon: 'booking', label: 'My Table Booking' },
					{ icon: 'history', label: 'Search History' },
					{ icon: 'feedback', label: 'Write Feedback' },
					{ icon: 'help-table', label: 'Help Center' },
					{ icon: 'faq', label: 'FAQs' },
					{ icon: 'logout', label: 'Logout' }
				]
	);

	function valueOrDash(value) {
		if (value === null || value === undefined || value === '') return '—';
		return value;
	}

	const detailRows = $derived(
		isBusiness
			? [
					{
						label: 'Restaurant',
						value: valueOrDash(restaurantProfile.restaurant_name)
					},
					{
						label: 'Cuisine',
						value: valueOrDash(restaurantProfile.cuisine_type)
					},
					{
						label: 'Phone',
						value: valueOrDash(restaurantProfile.phone_number)
					},
					{ label: 'Location', value: valueOrDash(restaurantProfile.location) },
					{
						label: 'Pickup Point',
						value: valueOrDash(restaurantProfile.pickup_location)
					}
				]
			: [
					{ label: 'Phone', value: valueOrDash(customerProfile.phone_number) },
					{ label: 'Gender', value: valueOrDash(customerProfile.gender) },
					{
						label: 'Default Pickup',
						value: valueOrDash(customerProfile.default_pickup_location)
					}
				]
	);
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header />

	{#if user}
		<div
			class="mx-8 my-2 flex shrink-0 items-center justify-between rounded-[7px] bg-gray-50 px-4 py-3"
		>
			<div class="flex flex-col gap-0.75">
				<p class="m-0 text-[16px] font-normal text-brand-dark italic">
					{valueOrDash(user.name)}
				</p>
				<p class="m-0 text-[13px] text-brand-dark italic">
					{valueOrDash(user.email)}
				</p>
				<span
					class="inline-block w-fit rounded-full px-2 py-0.5 text-[10px] text-white italic {isBusiness
						? 'bg-brand-dark'
						: 'bg-brand-yellow'}"
				>
					{isBusiness ? 'Business Account' : 'Customer Account'}
				</span>
			</div>
			<div class="relative h-12.25 w-12.25">
				<div
					class="absolute top-1.25 left-1.25 flex h-9.75 w-9.75 items-center justify-center overflow-hidden rounded-full bg-gray-100"
				>
					<Icon name="profile" width="32" height="38" />
				</div>
				<div
					class="absolute inset-0 rounded-full border-[0.75px] border-brand-gray-dark"
				></div>
			</div>
		</div>

		<div class="mx-8 my-2 flex shrink-0 gap-2">
			{#each quickActions as action}
				<button
					type="button"
					class="flex h-17.5 flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-[5px] border-none bg-gray-100 px-1 pt-2.5 pb-2 transition-all duration-200 hover:-translate-y-px hover:bg-gray-200"
				>
					<div class="flex h-7 items-center justify-center">
						<Icon name={action.icon} width="24" height="24" color="#757373" />
					</div>
					<span class="text-center text-[8px] text-brand-dark italic"
						>{action.label}</span
					>
				</button>
			{/each}
		</div>

		<div
			class="mx-8 my-2 shrink-0 rounded-[7px] border border-gray-100 bg-white"
		>
			<div class="border-b border-gray-100 bg-gray-50 px-4 py-2">
				<p class="text-[11px] text-brand-gray italic">
					{isBusiness ? 'Restaurant details' : 'Profile details'}
				</p>
			</div>
			<div class="divide-y divide-gray-100">
				{#each detailRows as row}
					<div class="flex items-start justify-between gap-4 px-4 py-2.5">
						<span class="text-[12px] text-brand-gray italic">{row.label}</span>
						<span class="text-right text-[12px] text-brand-dark italic"
							>{row.value}</span
						>
					</div>
				{/each}
			</div>
		</div>

		<div class="my-1 flex-1 overflow-y-auto px-8 pb-4">
			<p class="pb-1 text-[11px] text-brand-gray italic">Account & support</p>
			{#each accountMenuItems as item}
				{#if item.label === 'Logout'}
					<form method="POST" action="?/logout">
						<button
							type="submit"
							class="flex w-full cursor-pointer items-center gap-4 border-b border-none border-gray-100
							 bg-transparent py-3.5 transition-all duration-150 hover:-mx-1 hover:rounded-md hover:bg-gray-200 hover:px-1"
						>
							<div class="flex w-6 shrink-0 items-center justify-center">
								<Icon name={item.icon} width="20" height="20" color="#BDBDBD" />
							</div>
							<span
								class="flex-1 text-left text-[15px] font-normal text-brand-dark italic"
								>{item.label}</span
							>
							<Icon
								name="forward-arrow"
								width="7"
								height="11"
								color="#BDBDBD"
							/>
						</button>
					</form>
				{:else}
					<button
						type="button"
						class="flex w-full cursor-pointer items-center gap-4 border-b border-none border-gray-100
						 bg-transparent py-3.5 transition-all duration-150 hover:-mx-1 hover:rounded-md hover:bg-gray-200 hover:px-1"
					>
						<div class="flex w-6 shrink-0 items-center justify-center">
							<Icon name={item.icon} width="20" height="20" color="#BDBDBD" />
						</div>
						<span
							class="flex-1 text-left text-[15px] font-normal text-brand-dark italic"
							>{item.label}</span
						>
						<Icon name="forward-arrow" width="7" height="11" color="#BDBDBD" />
					</button>
				{/if}
			{/each}
		</div>
	{:else}
		<div
			class="mx-8 my-4 rounded-[7px] border border-red-200 bg-red-50 px-4 py-3"
		>
			<p class="text-[12px] text-red-500 italic">
				Unable to load account data. Please sign in again.
			</p>
		</div>
	{/if}
</div>
