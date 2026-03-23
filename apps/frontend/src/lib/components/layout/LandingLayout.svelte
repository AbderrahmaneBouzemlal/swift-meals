<script>
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';

	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<div class="flex min-h-dvh flex-col bg-[#FDFAF4]">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
