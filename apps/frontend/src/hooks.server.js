import { redirect } from '@sveltejs/kit';
import { api } from '$lib/utils/api.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { ROUTES } from '$lib/utils/routes.js';

function isOnboardingComplete(user) {
	if (!user) return false;

	const role = String(user.role || '').toLowerCase();
	const customerProfile = user.customer_profile;
	const businessProfile = user.business_profile;

	if (role === 'customer') {
		return Boolean(customerProfile);
	}

	if (role === 'business') {
		return Boolean(
			businessProfile?.restaurant_name && businessProfile?.location
		);
	}

	return false;
}

function getOnboardingRoute(user) {
	const role = String(user?.role || '').toLowerCase();
	return role === 'customer'
		? ROUTES.signUp.customer.profile
		: ROUTES.signUp.business.details;
}

export async function handle({ event, resolve }) {
	const pathname = event.url.pathname;
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

	const isSignUpRoute = pathname.startsWith('/sign-up');
	const isEntryAuthRoute = pathname === ROUTES.signIn;
	const isAuthRoute = isSignUpRoute || isEntryAuthRoute;

	if (event.locals.user && pathname === ROUTES.signUp.account) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);

		if (onboardingComplete) {
			throw redirect(303, ROUTES.account);
		}
		throw redirect(303, getOnboardingRoute(event.locals.user));
	}

	if (event.locals.user && isEntryAuthRoute) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);
		if (onboardingComplete) {
			throw redirect(303, ROUTES.account);
		}
		throw redirect(303, getOnboardingRoute(event.locals.user));
	}

	if (event.locals.user) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);

		if (!onboardingComplete && !isAuthRoute) {
			throw redirect(303, getOnboardingRoute(event.locals.user));
		} else if (event.url.pathname === '/') {
			//redirect to the listing page
		}
	} else {
		if (!isAuthRoute && event.url.pathname !== '/') {
			throw redirect(303, ROUTES.signIn);
		}
	}

	return await resolve(event);
}
