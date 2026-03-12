<script>
	let {
		children,
		size = 'medium', // small, medium, large, xl
		align = 'left', // left, center
		color = 'subtext-gray', // subtext-gray, brand-gray-dark, stone-400
		class: className = ''
	} = $props();

	const sizeClasses = {
		small: 'text-sm',
		medium: 'text-[15px]',
		large: 'text-lg',
		xl: 'text-xl'
	};

	const alignClasses = {
		left: 'text-left',
		center: 'text-center'
	};

	const colorClasses = {
		'subtext-gray': 'text-subtext-gray',
		'brand-gray-dark': 'text-brand-gray-dark',
		'stone-400': 'text-stone-400'
	};
</script>

<p
	class="m-0 font-abeezee italic {sizeClasses[size] || ''} {alignClasses[
		align
	] || ''} {colorClasses[color] || ''} {className}"
>
	{@render children?.()}
</p>
