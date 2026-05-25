import { classifyRoute } from '$lib/server/routeConfig.js';
import { preAuthGuard } from './preAuthGuard.js';
import { onboardingGuard } from './onBoardingGuard.js';
import { authGuard } from './authGuard.js';

// Guards run in order. Each one either throws a redirect or returns null.
// Return null means "not my responsibility, pass to next guard".
const GUARDS = [preAuthGuard, onboardingGuard, authGuard];

export function runGuards(event) {
	const routeType = classifyRoute(event.url.pathname);

	for (const guard of GUARDS) {
		guard(event, routeType); // throws redirect if triggered
	}
	// All guards passed — allow request through
}
