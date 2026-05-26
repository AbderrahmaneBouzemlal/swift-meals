import { redirect } from '@sveltejs/kit';
import { ROUTES } from '$lib/utils/routes.js';
import {
	isOnboardingComplete,
	getOnboardingRoute
} from '$lib/server/onBoarding';

// Handles fully protected routes
export function authGuard(event, routeType) {
	if (routeType !== 'protected' && routeType !== 'unknown') return null;

	// Not logged in
	if (!event.locals.user) throw redirect(303, ROUTES.signIn);

	// Logged in but onboarding incomplete
	if (!isOnboardingComplete(event.locals.user)) {
		const signupRole = event.cookies.get('signup_role');
		throw redirect(303, getOnboardingRoute(event.locals.user, signupRole, true));
	}

	// Unknown routes: fail safe — you can change this to a 404 if preferred
	if (routeType === 'unknown') throw redirect(303, ROUTES.home);

	return null;
}
