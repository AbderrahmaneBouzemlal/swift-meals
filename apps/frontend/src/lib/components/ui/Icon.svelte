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
{:else if name === 'profile'}
	<svg {width} {height} viewBox="0 0 32 38" fill="none">
		<path
			d="M16 19C20.9706 19 25 14.9706 25 10C25 5.02944 20.9706 1 6 1C11.0294 1 16 5.02944 16 10C16 14.9706 20.9706 19 16 19Z"
			fill={color}
		/>
		<path
			d="M30 33C30 27.4772 25.5228 23 20 23H12C6.47715 23 2 27.4772 2 33V34C2 35.1046 2.89543 36 4 36H28C29.1046 36 30 35.1046 30 34V33Z"
			fill={color}
		/>
	</svg>
{:else if name === 'forward-arrow'}
	<svg {width} {height} viewBox="0 0 7 11" fill="none">
		<path
			d="M1 1L6 5.5L1 10"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{:else if name === 'fail'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="white"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="10"></circle>
		<line x1="9" y1="9" x2="15" y2="15"></line>
		<line x1="15" y1="9" x2="9" y2="15"></line>
	</svg>
{:else if name === 'success'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="white"
		stroke-width="3"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="10"></circle>
		<path d="M8 12l3 3 5-5"></path>
	</svg>
{:else if name === 'warning'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="none"
		stroke="white"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M12 3l10 18H2L12 3z"></path>
		<line x1="12" y1="9" x2="12" y2="13"></line>
		<circle cx="12" cy="17" r="1"></circle>
	</svg>
{:else if name === 'heart'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<path
			d="M12 21s-7-4.35-9.5-8C-0.2 9.5 2.2 5 6.5 5C9 5 10.5 6.5 12 8C13.5 6.5 15 5 17.5 5C21.8 5 24.2 9.5 21.5 13C19 16.65 12 21 12 21Z"
			fill={color}
		/>
	</svg>
{:else if name === 'bell'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<path
			d="M18 8A6 6 0 006 8v5l-2 2h16l-2-2V8z"
			stroke={color}
			stroke-width="2"
		/>
		<circle cx="12" cy="19" r="2" fill={color} />
	</svg>
{:else if name === 'card'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<rect
			x="2"
			y="5"
			width="20"
			height="14"
			rx="2"
			stroke={color}
			stroke-width="2"
		/>
		<line x1="2" y1="10" x2="22" y2="10" stroke={color} stroke-width="2" />
	</svg>
{:else if name === 'settings'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<circle cx="12" cy="12" r="3" stroke={color} stroke-width="2" />
		<path
			d="M19.4 15A7.97 7.97 0 0020 12a7.97 7.97 0 00-.6-3l2.1-1.6-2-3.4-2.5 1a8.1 8.1 0 00-2.6-1.5L14 1h-4l-.4 2.5a8.1 8.1 0 00-2.6 1.5l-2.5-1-2 3.4L4.6 9A7.97 7.97 0 004 12c0 1 .2 2 .6 3l-2.1 1.6 2 3.4 2.5-1a8.1 8.1 0 002.6 1.5L10 23h4l.4-2.5a8.1 8.1 0 002.6-1.5l2.5 1 2-3.4L19.4 15z"
			stroke={color}
			stroke-width="1.5"
		/>
	</svg>
{:else if name === 'order'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<rect
			x="3"
			y="4"
			width="18"
			height="16"
			rx="2"
			stroke={color}
			stroke-width="2"
		/>
		<line x1="7" y1="8" x2="17" y2="8" stroke={color} stroke-width="2" />
		<line x1="7" y1="12" x2="17" y2="12" stroke={color} stroke-width="2" />
	</svg>
{:else if name === 'booking'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<rect
			x="3"
			y="5"
			width="18"
			height="16"
			rx="2"
			stroke={color}
			stroke-width="2"
		/>
		<line x1="3" y1="10" x2="21" y2="10" stroke={color} stroke-width="2" />
	</svg>
{:else if name === 'help-table'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<circle cx="12" cy="12" r="10" stroke={color} stroke-width="2" />
		<path
			d="M9.5 9a2.5 2.5 0 115 0c0 2-2.5 2-2.5 4"
			stroke={color}
			stroke-width="2"
		/>
		<circle cx="12" cy="17" r="1" fill={color} />
	</svg>
{:else if name === 'history'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<path d="M3 12a9 9 0 109-9" stroke={color} stroke-width="2" />
		<polyline points="3 3 3 9 9 9" stroke={color} stroke-width="2" />
	</svg>
{:else if name === 'about'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<circle cx="12" cy="12" r="10" stroke={color} stroke-width="2" />
		<line x1="12" y1="10" x2="12" y2="16" stroke={color} stroke-width="2" />
		<circle cx="12" cy="7" r="1" fill={color} />
	</svg>
{:else if name === 'feedback'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<path
			d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"
			stroke={color}
			stroke-width="2"
		/>
	</svg>
{:else if name === 'faq'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<circle cx="12" cy="12" r="10" stroke={color} stroke-width="2" />
		<path
			d="M9.5 9a2.5 2.5 0 115 0c0 2-2.5 2-2.5 3"
			stroke={color}
			stroke-width="2"
		/>
		<circle cx="12" cy="17" r="1" fill={color} />
	</svg>
{:else if name === 'logout'}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<path d="M10 17l5-5-5-5" stroke={color} stroke-width="2" />
		<line x1="15" y1="12" x2="3" y2="12" stroke={color} stroke-width="2" />
		<path d="M21 3v18" stroke={color} stroke-width="2" />
	</svg>
{:else}
	<svg {width} {height} viewBox="0 0 24 24" fill="none">
		<rect
			x="2"
			y="5"
			width="20"
			height="14"
			rx="2"
			stroke={color}
			stroke-width="2"
		/>
		<line x1="2" y1="10" x2="22" y2="10" stroke={color} stroke-width="2" />
	</svg>
{/if}
