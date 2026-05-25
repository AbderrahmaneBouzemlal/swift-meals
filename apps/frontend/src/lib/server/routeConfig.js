import { ROUTES } from '$lib/utils/routes.js';

export const ROUTE_ACCESS = {
	public: [ROUTES.home],
	preAuth: [
		// Accessible only to unauthenticated users
		ROUTES.signIn,
		ROUTES.signUp.chooseRole,
		ROUTES.signUp.account
	],
	onboarding: [
		// Requires auth, but onboarding may be incomplete
		ROUTES.signUp.customer.profile,
		ROUTES.signUp.business.details,
		ROUTES.signUp.business.setup,
		ROUTES.signUp.review
	],
	protected: [
		// Requires auth + completed onboarding
		ROUTES.account,
		ROUTES.dashboard.today,
		ROUTES.dashboard.orders,
		ROUTES.favorites,
		ROUTES.settings,
		ROUTES.notifications,
		ROUTES.payment
	]
};

export function classifyRoute(pathname) {
	if (ROUTE_ACCESS.public.includes(pathname)) return 'public';
	if (ROUTE_ACCESS.preAuth.includes(pathname)) return 'preAuth';
	if (ROUTE_ACCESS.onboarding.includes(pathname)) return 'onboarding';
	if (
		ROUTE_ACCESS.protected.some((r) =>
			typeof r === 'string' ? pathname.startsWith(r) : r.test(pathname)
		)
	)
		return 'protected';
	return 'unknown'; // unregistered routes fail safe below
}
