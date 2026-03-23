<script>
	import AppLayout from '$lib/components/layout/AppLayout.svelte';
	let { data, children } = $props();
</script>

<AppLayout user={data.user}>
	{@render children()}
</AppLayout>
