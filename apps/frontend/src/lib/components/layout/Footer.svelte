<script>
	import logo from '$lib/assets/logo.svg';
	import { ROUTES } from '$lib/utils/routes.js';
</script>

<footer class="w-full border-t border-brand-gray-light bg-white py-16">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-4">
			<!-- Column 1: Brand -->
			<div class="flex flex-col gap-6">
				<div class="flex items-center gap-3">
					<img src={logo} alt="Swift Meals" class="h-10 w-10" />
					<span class="text-xl font-bold text-brand-dark italic">Swift Meals</span>
				</div>
				<p class="text-sm leading-relaxed text-brand-gray-dark italic">
					Delicious meals from your favorite campus restaurants, delivered fast to your doorstep.
				</p>
			</div>

			<!-- Column 2: Platform -->
			<div>
				<h4 class="mb-6 text-sm font-bold text-brand-dark uppercase tracking-wider italic">Platform</h4>
				<ul class="flex flex-col gap-4 text-sm text-brand-gray-dark italic">
					<li><a href="#how-it-works" class="hover:text-brand-yellow">How it Works</a></li>
					<li><a href="#features" class="hover:text-brand-yellow">Features</a></li>
					<li><a href={ROUTES.signUp.chooseRole} class="hover:text-brand-yellow">Get Started</a></li>
				</ul>
			</div>

			<!-- Column 3: Support -->
			<div>
				<h4 class="mb-6 text-sm font-bold text-brand-dark uppercase tracking-wider italic">Support</h4>
				<ul class="flex flex-col gap-4 text-sm text-brand-gray-dark italic">
					<li><a href={ROUTES.support} class="hover:text-brand-yellow">Help Center</a></li>
					<li><a href={ROUTES.faq} class="hover:text-brand-yellow">FAQs</a></li>
					<li><a href={ROUTES.feedback} class="hover:text-brand-yellow">Feedback</a></li>
				</ul>
			</div>

			<!-- Column 4: Legal -->
			<div>
				<h4 class="mb-6 text-sm font-bold text-brand-dark uppercase tracking-wider italic">Legal</h4>
				<ul class="flex flex-col gap-4 text-sm text-brand-gray-dark italic">
					<li><a href="/terms" class="hover:text-brand-yellow">Terms of Service</a></li>
					<li><a href="/privacy" class="hover:text-brand-yellow">Privacy Policy</a></li>
				</ul>
			</div>
		</div>

		<div class="mt-16 border-t border-brand-gray-light pt-8 text-center">
			<p class="text-xs text-brand-gray italic">
				&copy; {new Date().getFullYear()} Swift Meals. All rights reserved. Made for students, by students.
			</p>
		</div>
	</div>
</footer>
