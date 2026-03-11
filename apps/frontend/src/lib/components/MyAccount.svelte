<script>
	import Header from './Header.svelte';
	import ChatButton from './ui/ChatButton.svelte';
	import Icon from './ui/Icon.svelte';

	const quickActions = [
		{ icon: 'heart', label: 'Favourite' },
		{ icon: 'bell', label: 'Notifications' },
		{ icon: 'card', label: 'Payment' },
		{ icon: 'settings', label: 'Settings' }
	];

	const menuItems = [
		{ icon: 'order', label: 'My Order' },
		{ icon: 'booking', label: 'My Table Booking' },
		{ icon: 'help-table', label: 'Help Table' },
		{ icon: 'history', label: 'Search History' },
		{ icon: 'about', label: 'About App' },
		{ icon: 'feedback', label: 'Write Feedback' },
		{ icon: 'faq', label: 'FAQs' },
		{ icon: 'logout', label: 'Logout' }
	];
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header />

	<div
		class="mx-8 my-2 flex shrink-0 items-center justify-between rounded-[7px] bg-gray-50 px-4 py-3"
	>
		<div class="flex flex-col gap-0.75">
			<p class="m-0 text-[16px] font-normal text-brand-dark italic">ABHIJITH</p>
			<p class="m-0 text-[13px] text-brand-dark italic">abhijith@gmail.com</p>
			<button
				class="cursor-pointer border-none bg-transparent p-0 text-left font-abeezee text-[8px] text-brand-dark italic hover:underline"
				>View activity</button
			>
		</div>
		<!-- Avatar -->
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

	<div class="my-1 flex-1 overflow-y-auto px-8">
		{#each menuItems as item, i}
			<button
				class="flex w-full cursor-pointer items-center gap-4 border-b border-none border-gray-100 bg-transparent py-3.5 transition-all duration-150 hover:-mx-1 hover:rounded-md hover:bg-gray-200 hover:px-1"
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
		{/each}
	</div>

	<div class="mt-auto">
		<ChatButton />
	</div>
</div>
