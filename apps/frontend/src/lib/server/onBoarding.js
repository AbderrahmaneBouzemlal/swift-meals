import { ROUTES } from '$lib/utils/routes.js';

export function isOnboardingComplete(user) {
	if (!user) return false;

	const role = String(user.role);

	if (role === 'CUSTOMER') return Boolean(user.customer_profile);

	if (role === 'BUSINESS') {
		return Boolean(
			user.business_profile?.restaurant_name && user.business_profile?.location
		);
	}

	return false;
}

export function getOnboardingRoute(user, signupRole = null, cont = false) {
	const param = `continue=${cont}`;
	const role = user?.role || signupRole;

	if (role === 'CUSTOMER')
		return ROUTES.byparam(ROUTES.signUp.customer.profile, param);
	if (role === 'BUSINESS')
		return ROUTES.byparam(ROUTES.signUp.business.details, param);

	return ROUTES.signUp.chooseRole;
}
