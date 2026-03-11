<script>
	export let name;
	export let width = '24';
	export let height = '24';
	export let fill = 'none';
	export let color = '#595454';
</script>

{#if name === 'apple'}
	<svg {width} {height} viewBox="0 0 22 26" {fill}>
		<path
			d="M18.5 13.5C18.5 10.5 20.2 8.8 21.5 7.8C20.3 6 18.5 5 16.8 5C14.8 5 13.8 6 12 6C10.2 6 9.2 5 7.5 5C4.5 5 1.5 7.5 1.5 12C1.5 17 5 23 8 23C9.5 23 10.5 22 12 22C13.5 22 14.2 23 16 23C19 23 21.5 17 21.5 17C19.5 16 18.5 15 18.5 13.5ZM15 3C15.8 2 16.5 0.5 16.5 0C15 0.2 13.2 1 12 2.2C11 3.2 10.2 4.5 10.2 5C11.8 5 13.5 4.2 15 3Z"
			fill={color}
		/>
	</svg>
{:else if name === 'google'}
	<svg {width} {height} viewBox="0 0 24 24" {fill}>
		<path
			d="M22.5 12.2C22.5 11.4 22.4 10.6 22.3 10H12V14.2H17.9C17.6 15.6 16.8 16.8 15.6 17.6V20.3H19.2C21.3 18.3 22.5 15.5 22.5 12.2Z"
			fill="#4285F4"
		/>
		<path
			d="M12 23C14.9 23 17.3 22.1 19.2 20.3L15.6 17.6C14.6 18.3 13.4 18.7 12 18.7C9.1 18.7 6.7 16.7 5.8 14H2V16.8C3.9 20.5 7.7 23 12 23Z"
			fill="#34A853"
		/>
		<path
			d="M5.8 14C5.6 13.4 5.5 12.7 5.5 12C5.5 11.3 5.6 10.6 5.8 10V7.2H2C1.3 8.6 1 10.3 1 12C1 13.7 1.3 15.4 2 16.8L5.8 14Z"
			fill="#FBBC05"
		/>
		<path
			d="M12 5.3C13.5 5.3 14.9 5.8 16 6.9L19.3 3.6C17.3 1.8 14.9 1 12 1C7.7 1 3.9 3.5 2 7.2L5.8 10C6.7 7.3 9.1 5.3 12 5.3Z"
			fill="#EA4335"
		/>
	</svg>
{:else if name === 'facebook'}
	<svg {width} {height} viewBox="0 0 22 22" {fill}>
		<path
			d="M22 11C22 4.9 17.1 0 11 0C4.9 0 0 4.9 0 11C0 16.5 4 21.1 9.2 21.9V14.2H6.5V11H9.2V8.6C9.2 5.9 10.8 4.5 13.3 4.5C14.4 4.5 15.6 4.7 15.6 4.7V7.4H14.3C12.9 7.4 12.5 8.3 12.5 9.2V11H15.5L14.9 14.2H12.5V21.9C17.7 21.1 22 16.5 22 11Z"
			fill="#1877F2"
		/>
	</svg>
{:else if name === 'chat'}
	<svg {width} {height} viewBox="0 0 16 14" fill="none">
		<path
			d="M14 0H2C0.9 0 0 0.9 0 2V10C0 11.1 0.9 12 2 12H5L8 14L11 12H14C15.1 12 16 11.1 16 10V2C16 0.9 15.1 0 14 0Z"
			fill={color}
		/>
	</svg>
{:else if name === 'mail'}
	<svg {width} {height} viewBox="0 0 18 14" fill="none">
		<rect x="0.5" y="0.5" width="17" height="13" rx="2.5" stroke={color} />
		<path
			d="M1 1L9 8L17 1"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'eye-closed'}
	<svg {width} {height} viewBox="0 0 18 16" fill="none">
		<path
			d="M1 1L17 15M7.5 4.5C8 4.2 8.5 4 9 4C11.2 4 13 5.8 13 8C13 8.5 12.9 9 12.7 9.4M3.8 5.4C2.3 6.3 1 8 1 8C1 8 4 14 9 14C10.6 14 12.1 13.4 13.3 12.5"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
		/>
	</svg>
{:else if name === 'eye-open'}
	<svg {width} {height} viewBox="0 0 18 14" fill="none">
		<path
			d="M1 7C1 7 4 1 9 1C14 1 17 7 17 7C17 7 14 13 9 13C4 13 1 7 1 7Z"
			stroke={color}
			stroke-width="1.5"
		/>
		<circle cx="9" cy="7" r="2.5" stroke={color} stroke-width="1.5" />
	</svg>
{:else if name === 'back-arrow'}
	<svg {width} {height} viewBox="0 0 24 20" fill="none">
		<path
			d="M22 10H2M2 10L10 2M2 10L10 18"
			stroke={color}
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'arrow-right'}
	<svg {width} {height} viewBox="0 0 20 12" fill="none">
		<path
			d="M1 6H19M19 6L14 1M19 6L14 11"
			stroke={color}
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'check'}
	<svg {width} {height} viewBox="0 0 10 8" fill="none">
		<path
			d="M1 4L3.5 6.5L9 1"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'signal'}
	<svg {width} {height} viewBox="0 0 17 12" fill="none">
		<rect x="0" y="3" width="3" height="9" rx="1" fill={color} />
		<rect x="4.5" y="2" width="3" height="10" rx="1" fill={color} />
		<rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={color} />
		<rect x="13.5" y="0" width="3" height="12" rx="1" fill={color} />
	</svg>
{:else if name === 'wifi'}
	<svg {width} {height} viewBox="0 0 16 12" fill="none">
		<path
			d="M8 2.4C10.2 2.4 12.2 3.3 13.7 4.8L15.5 3C13.5 1.1 10.9 0 8 0C5.1 0 2.5 1.1 0.5 3L2.3 4.8C3.8 3.3 5.8 2.4 8 2.4Z"
			fill={color}
		/>
		<path
			d="M8 5.6C9.4 5.6 10.7 6.1 11.7 7L13.5 5.2C12 3.8 10.1 3 8 3C5.9 3 4 3.8 2.5 5.2L4.3 7C5.3 6.1 6.6 5.6 8 5.6Z"
			fill={color}
		/>
		<circle cx="8" cy="10" r="2" fill={color} />
	</svg>
{:else if name === 'battery'}
	<svg {width} {height} viewBox="0 0 25 12" fill="none">
		<rect
			x="0.5"
			y="0.5"
			width="21"
			height="11"
			rx="3.5"
			stroke={color}
			stroke-opacity="0.35"
		/>
		<rect x="2" y="2" width="17" height="8" rx="2" fill={color} />
		<path
			d="M23 4.5V7.5C23.8 7.2 24.5 6.7 24.5 6C24.5 5.3 23.8 4.8 23 4.5Z"
			fill={color}
			fill-opacity="0.4"
		/>
	</svg>
{/if}
