import { redirect } from '@sveltejs/kit';
import { api } from '$lib/utils/api.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { ROUTES } from '$lib/utils/routes.js';

function isOnboardingComplete(user) {
	if (!user) return false;

	const role = String(user.role || '').toLowerCase();
	const customerProfile = user.student_profile;
	const businessProfile = user.restaurant_profile;

	if (role === 'customer') {
		// Customer profile fields are optional, so existence is enough.
		return Boolean(customerProfile);
	}

	if (role === 'business') {
		// Business setup is considered complete once required core fields exist.
		return Boolean(
			businessProfile?.restaurant_name && businessProfile?.location
		);
	}

	return false;
}

export async function handle({ event, resolve }) {
	const session = event.cookies.get('session');
	event.locals.user = null;

	if (session) {
		try {
			const user = await api.get(ENDPOINTS.profile.me, { token: session });
			event.locals.user = user;
		} catch (err) {
			event.cookies.delete('session', { path: '/' });
		}
	}

	const isAuthRoute =
		event.url.pathname.startsWith('/sign-in') ||
		event.url.pathname.startsWith('/sign-up') ||
		event.url.pathname.startsWith('/login') ||
		event.url.pathname === '/choose-role';

	if (event.locals.user && isAuthRoute) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);

		if (onboardingComplete) {
			throw redirect(303, ROUTES.account);
		}
	}

	// Protection & Onboarding Enforcement
	if (event.locals.user) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);

		if (!onboardingComplete && !isAuthRoute) {
			const role = event.locals.user.role.toLowerCase();
			if (role === 'customer') {
				throw redirect(303, ROUTES.signUp.customer.profile);
			} else {
				throw redirect(303, ROUTES.signUp.business.details);
			}
		}
	} else {
		if (!isAuthRoute && event.url.pathname !== '/') {
			throw redirect(303, ROUTES.signIn);
		}
	}

	return await resolve(event);
}
