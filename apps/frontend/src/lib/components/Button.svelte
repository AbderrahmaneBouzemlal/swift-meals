<script>
	import { goto } from '$app/navigation';
	import PrimaryButton from './ui/PrimaryButton.svelte';
</script>

<PrimaryButton
	text="Continue"
	icon="arrow-right"
	onclick={() => goto('/login')}
/>
