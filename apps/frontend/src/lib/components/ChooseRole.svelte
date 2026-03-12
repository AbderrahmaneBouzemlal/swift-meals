<script>
	import Header from './Header.svelte';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import ChatButton from './ui/ChatButton.svelte';
	import Icon from './ui/Icon.svelte';
	import { setRole } from '$lib/stores/registration.svelte.js';

	let selected = null;

	function choose(role) {
		setRole(role);
		goto('/sign-up');
	}
</script>

<div
	class="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-white font-abeezee shadow-2xl sm:my-8 sm:min-h-211 sm:rounded-phone"
>
	<Header backUrl="/login" />

	<div class="flex flex-1 flex-col gap-6 overflow-y-auto px-8 pt-4">
		<div class="text-center">
			<h1
				class="m-0 mt-0 mb-1.5 text-[32px] font-normal text-brand-dark italic"
			>
				I am a...
			</h1>
			<p class="m-0 text-[14px] text-brand-gray italic">
				Tell us how you'll be using Swift Meals
			</p>
		</div>

		<div class="flex flex-col gap-0">
			<button
				class="relative flex w-full cursor-pointer items-center gap-4 rounded-[14px] border-2 border-transparent bg-brand-light p-5 text-left transition-all duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-white hover:shadow-[0_4px_20px_rgba(252,189,11,0.2)]
				{selected === 'customer'
					? 'scale-[1.01] border-brand-yellow! bg-white! shadow-[0_6px_24px_rgba(252,189,11,0.25)]'
					: ''}"
				onclick={() => choose('customer')}
			>
				<div
					class="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
				>
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
						<rect
							x="12"
							y="22"
							width="40"
							height="34"
							rx="4"
							fill="#FCBD0B"
							opacity="0.15"
						/>
						<rect
							x="12"
							y="22"
							width="40"
							height="34"
							rx="4"
							stroke="#FCBD0B"
							stroke-width="2.5"
						/>
						<path
							d="M22 22V18C22 12.5 42 12.5 42 18V22"
							stroke="#FCBD0B"
							stroke-width="2.5"
							stroke-linecap="round"
						/>
						<circle cx="32" cy="38" r="8" fill="#FCBD0B" opacity="0.8" />
						<path
							d="M27 38C27 38 29 34 32 34C35 34 37 38 37 38"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<path
							d="M27 38C27 38 29 42 32 42C35 42 37 38 37 38"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<path
							d="M6 30L11 32L6 34"
							stroke="#FCBD0B"
							stroke-width="2"
							stroke-linecap="round"
							opacity="0.5"
						/>
						<path
							d="M58 30L53 32L58 34"
							stroke="#FCBD0B"
							stroke-width="2"
							stroke-linecap="round"
							opacity="0.5"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h2
						class="m-0 mt-0 mb-1 text-[20px] font-normal text-brand-dark italic"
					>
						customer
					</h2>
					<p class="m-0 text-[12px] leading-[1.4] text-subtext-gray italic">
						Order food from your favourite restaurants
					</p>
				</div>
				<div
					class="absolute top-3 right-9 origin-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
					{selected === 'customer' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<circle cx="10" cy="10" r="10" fill="#FCBD0B" />
						<path
							d="M5 10L8.5 13.5L15 7"
							stroke="white"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div class="shrink-0">
					<svg width="8" height="14" viewBox="0 0 8 14" fill="none">
						<path
							d="M1 1L7 7L1 13"
							stroke="#BDBDBD"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</button>

			\
			<div class="flex items-center gap-3 px-1 py-4">
				<div class="h-px flex-1 bg-brand-gray-light"></div>
				<span class="text-[14px] text-brand-gray italic">or</span>
				<div class="h-px flex-1 bg-brand-gray-light"></div>
			</div>

			<button
				class="relative flex w-full cursor-pointer items-center gap-4 rounded-[14px] border-2 border-transparent bg-brand-light p-5 text-left transition-all duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-white hover:shadow-[0_4px_20px_rgba(252,189,11,0.2)]
				{selected === 'business'
					? 'scale-[1.01] border-brand-yellow! bg-white! shadow-[0_6px_24px_rgba(252,189,11,0.25)]'
					: ''}"
				onclick={() => choose('business')}
			>
				<div
					class="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
				>
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
						<!-- Shop/business front -->
						<rect
							x="10"
							y="28"
							width="44"
							height="30"
							rx="3"
							fill="#595454"
							opacity="0.1"
						/>
						<rect
							x="10"
							y="28"
							width="44"
							height="30"
							rx="3"
							stroke="#595454"
							stroke-width="2.5"
						/>
						<!-- Roof/awning -->
						<path d="M6 28H58L54 18H10L6 28Z" fill="#595454" opacity="0.15" />
						<path
							d="M6 28H58L54 18H10L6 28Z"
							stroke="#595454"
							stroke-width="2.5"
							stroke-linejoin="round"
						/>
						<!-- Door -->
						<rect
							x="27"
							y="40"
							width="10"
							height="18"
							rx="2"
							fill="#595454"
							opacity="0.2"
						/>
						<rect
							x="27"
							y="40"
							width="10"
							height="18"
							rx="2"
							stroke="#595454"
							stroke-width="2"
						/>
						<!-- Windows -->
						<rect
							x="14"
							y="34"
							width="10"
							height="8"
							rx="2"
							fill="#FCBD0B"
							opacity="0.4"
						/>
						<rect
							x="40"
							y="34"
							width="10"
							height="8"
							rx="2"
							fill="#FCBD0B"
							opacity="0.4"
						/>
						<!-- Sign -->
						<path
							d="M22 18L32 10L42 18"
							stroke="#595454"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<!-- Star accent -->
						<circle cx="32" cy="8" r="3" fill="#FCBD0B" />
					</svg>
				</div>
				<div class="flex-1">
					<h2
						class="m-0 mt-0 mb-1 text-[20px] font-normal text-brand-dark italic"
					>
						business
					</h2>
					<p class="m-0 text-[12px] leading-[1.4] text-subtext-gray italic">
						List your business and manage orders
					</p>
				</div>
				<div
					class="absolute top-3 right-9 origin-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
					{selected === 'business' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<circle cx="10" cy="10" r="10" fill="#FCBD0B" />
						<path
							d="M5 10L8.5 13.5L15 7"
							stroke="white"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div class="shrink-0">
					<svg width="8" height="14" viewBox="0 0 8 14" fill="none">
						<path
							d="M1 1L7 7L1 13"
							stroke="#BDBDBD"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</button>
		</div>

		<div class="flex flex-col gap-2.5 px-1 py-2">
			<div
				class="m-0 flex items-center gap-2.5 text-[13px] text-subtext-gray italic"
			>
				<div class="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow"></div>
				<span>Fast delivery to your door</span>
			</div>
			<div
				class="m-0 flex items-center gap-2.5 text-[13px] text-subtext-gray italic"
			>
				<div class="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow"></div>
				<span>Grow your business business</span>
			</div>
			<div
				class="m-0 flex items-center gap-2.5 text-[13px] text-subtext-gray italic"
			>
				<div class="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow"></div>
				<span>Switch roles any time</span>
			</div>
		</div>
	</div>

	<div class="mt-auto">
		<ChatButton />
	</div>
</div>
