import { redirect } from '@sveltejs/kit';
import { ROUTES } from '$lib/utils/routes.js';
import {
	isOnboardingComplete,
	getOnboardingRoute
} from '$lib/server/onBoarding';

// Handles routes that require auth but allow incomplete onboarding
export function onboardingGuard(event, routeType) {
	if (routeType !== 'onboarding') return null;

	// Not logged in — send to sign in
	if (!event.locals.user) throw redirect(303, ROUTES.signIn);

	// Logged in + already done onboarding — send to app
	if (isOnboardingComplete(event.locals.user))
		throw redirect(303, ROUTES.account);

	if (event.url.pathname === ROUTES.signUp.chooseRole) {
		return;
	}

	return null; // all good, let through
}
