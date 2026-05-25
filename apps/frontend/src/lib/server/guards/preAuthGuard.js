import { redirect } from '@sveltejs/kit';
import { ROUTES } from '$lib/utils/routes.js';
import { isOnboardingComplete, getOnboardingRoute } from '$lib/server/onBoarding';

// Kicks authenticated users away from sign-in / sign-up routes
export function preAuthGuard(event, routeType) {
    if (routeType !== 'preAuth') return null; // not our concern
    if (!event.locals.user) return null;      // unauthenticated, let through

    const onboardingComplete = isOnboardingComplete(event.locals.user);
    throw redirect(303, onboardingComplete
        ? ROUTES.account
        : getOnboardingRoute(event.locals.user, true)
    );
}