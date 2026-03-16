<script>
	let {
		children,
		size = 'medium', // small, medium, large
		align = 'left', // left, center
		weight = 'normal', // normal, bold
		color = 'brand-dark', // brand-dark, stone-800
		class: className = ''
	} = $props();

	const sizeClasses = {
		small: 'text-xl',
		medium: 'text-[28px]',
		large: 'text-4xl'
	};

	const alignClasses = {
		left: 'text-left',
		center: 'text-center'
	};

	const weightClasses = {
		normal: 'font-normal',
		bold: 'font-bold'
	};

	const colorClasses = {
		'brand-dark': 'text-brand-dark',
		'stone-800': 'text-stone-800'
	};
</script>

<h1
	class="m-0 font-abeezee italic {sizeClasses[size] || ''} {alignClasses[
		align
	] || ''} {weightClasses[weight] || ''} {colorClasses[color] ||
		''} {className}"
>
	{@render children?.()}
</h1>
