<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toasts from '$lib/components/ui/Toasts.svelte';

	let { children } = $props();
</script>

<svelte:head
	><link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&family=Outfit:wght@100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<div class="min-w-dvw">
	<Toasts />
	{@render children()}
</div>
