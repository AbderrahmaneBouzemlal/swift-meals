<script>
	import { goto } from '$app/navigation';
	import LandingLayout from '$lib/components/layout/LandingLayout.svelte';
	import PrimaryButton from '$lib/components/ui/PrimaryButton.svelte';
	import { ROUTES } from '$lib/utils/routes.js';
	import HeroImage from '$lib/components/HeroImage.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { platform } from '$lib/utils/platform.svelte.js';
	import AuthLayout from '$lib/components/layout/AuthLayout.svelte';
</script>

{#if platform.isCapacitor}
	<AuthLayout showMobileHero={true}>
		<div
			class="flex h-full flex-col items-center justify-center gap-4 rounded-t-3xl bg-[#FDFAF4] px-8 pt-12 pb-24 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:rounded-none lg:bg-white lg:shadow-none"
		>
			<PrimaryButton
				text="Get Started"
				icon="arrow-right"
				onclick={() => goto(ROUTES.signUp.chooseRole)}
			/>
			<PrimaryButton
				text="Sign In"
				variant="secondary"
				onclick={() => goto(ROUTES.signIn)}
			/>
		</div>
	</AuthLayout>
{:else if platform.isLoaded}
	<LandingLayout>
		<!-- Hero Section -->
		<section class="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:py-32">
			
			<div class="flex-1 opacity-0 animate-float [animation-delay:200ms] [animation-fill-mode:forwards]">
				<HeroImage hideOnMobile={false} />
			</div>
            <div class="flex-1 text-center lg:text-left">
				<h1 class="mb-6 text-5xl font-black tracking-tight text-brand-dark lg:text-7xl italic">
					Delicious Meals, <br />
					<span class="text-brand-yellow">Delivered Fast.</span>
				</h1>
				<p class="mb-10 text-xl text-brand-gray-dark italic lg:max-w-xl">
					Swift Meals brings your favorite campus restaurants directly to your doorstep. Save time, skip the queues, and enjoy your meal.
				</p>
				<div class="flex flex-col items-center gap-4 lg:flex-row">
					<PrimaryButton
						text="Get Started Now"
						icon="arrow-right"
						onclick={() => goto(ROUTES.signUp.chooseRole)}
					/>
					<button
						onclick={() => goto(ROUTES.signIn)}
						class="text-sm font-bold text-brand-dark transition-colors hover:text-brand-yellow italic"
					>
						Already have an account? Sign In
					</button>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section id="features" class="bg-white py-24">
			<div class="mx-auto max-w-7xl px-6 text-center">
				<h2 class="mb-16 text-3xl font-bold text-brand-dark lg:text-5xl italic">Why Swift Meals?</h2>
				<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
					<div class="flex flex-col items-center gap-6">
						<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
							<Icon name="order" width="32" height="32" color="#fcbd0b" />
						</div>
						<h3 class="text-xl font-bold text-brand-dark italic">Fast Delivery</h3>
						<p class="text-brand-gray-dark italic">Average delivery time of just 15 minutes within campus.</p>
					</div>
					<div class="flex flex-col items-center gap-6">
						<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
							<Icon name="success" width="32" height="32" color="#fcbd0b" />
						</div>
						<h3 class="text-xl font-bold text-brand-dark italic">Quality Food</h3>
						<p class="text-brand-gray-dark italic">We partner with the best-rated restaurants on campus.</p>
					</div>
					<div class="flex flex-col items-center gap-6">
						<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
							<Icon name="profile" width="32" height="32" color="#fcbd0b" />
						</div>
						<h3 class="text-xl font-bold text-brand-dark italic">Student Friendly</h3>
						<p class="text-brand-gray-dark italic">Prices and features tailored for the student community.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- How it Works Section -->
		<section id="how-it-works" class="py-24">
			<div class="mx-auto max-w-7xl px-6">
				<h2 class="mb-16 text-center text-3xl font-bold text-brand-dark lg:text-5xl italic">How it Works</h2>
				<div class="flex flex-col gap-12 lg:flex-row">
					<div class="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-10 shadow-sm">
						<span class="text-4xl font-black text-brand-yellow/30 italic">01</span>
						<h3 class="text-2xl font-bold text-brand-dark italic">Choose Role</h3>
						<p class="text-brand-gray-dark italic">Sign up as a Customer to order, or as a Business to sell your food.</p>
					</div>
					<div class="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-10 shadow-sm">
						<span class="text-4xl font-black text-brand-yellow/30 italic">02</span>
						<h3 class="text-2xl font-bold text-brand-dark italic">Place Order</h3>
						<p class="text-brand-gray-dark italic">Browse menus, add items to your cart, and checkout in seconds.</p>
					</div>
					<div class="flex flex-1 flex-col gap-4 rounded-3xl bg-white p-10 shadow-sm">
						<span class="text-4xl font-black text-brand-yellow/30 italic">03</span>
						<h3 class="text-2xl font-bold text-brand-dark italic">Enjoy</h3>
						<p class="text-brand-gray-dark italic">Track your order and pick it up from your favorite spot on campus.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Final CTA Section -->
		<section class="bg-brand-dark py-24 text-center">
			<div class="mx-auto max-w-4xl px-6">
				<h2 class="mb-8 text-4xl font-bold text-white lg:text-6xl italic">Ready to start?</h2>
				<p class="mb-12 text-xl text-brand-gray italic">Join thousands of students and sellers on Swift Meals.</p>
				<PrimaryButton
					text="Create Your Account"
					icon="arrow-right"
					onclick={() => goto(ROUTES.signUp.chooseRole)}
				/>
			</div>
		</section>
	</LandingLayout>
{/if}

<style>
	:global(.animate-float) {
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0);
			opacity: 1;
		}
		50% {
			transform: translateY(-20px);
			opacity: 1;
		}
	}
</style>
