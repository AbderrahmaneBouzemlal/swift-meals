<script>
	import Sidebar from './Sidebar.svelte';
	import BottomNav from './BottomNav.svelte';

	/** @type {{ children: import('svelte').Snippet, user: any }} */
	let { children, user } = $props();

	const role = $derived((user?.role ?? '').toLowerCase());
</script>

<div class="flex min-h-dvh w-full bg-[#f8f9fa] lg:flex-row">
	<!-- Desktop Sidebar -->
	<div class="hidden lg:block">
		<Sidebar {role} />
	</div>

	<!-- Main Content Area -->
	<main class="relative flex flex-1 flex-col overflow-x-hidden pb-24 lg:pb-0">
		<div class="mx-auto flex w-full flex-1 flex-col lg:p-8">
			<div class="flex-1 bg-white shadow-sm lg:rounded-3xl">
				{@render children()}
			</div>
		</div>
	</main>

	<!-- Mobile Bottom Nav -->
	<BottomNav {role} />
</div>
