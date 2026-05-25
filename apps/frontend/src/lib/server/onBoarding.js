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

export function getOnboardingRoute(user, cont = false) {
	const param = `continue=${cont}`;

	if (user.role === 'CUSTOMER')
		return ROUTES.byparam(ROUTES.signUp.customer.profile, param);
	if (user.role === 'BUSINESS')
		return ROUTES.byparam(ROUTES.signUp.business.details, param);

	return ROUTES.signUp.chooseRole;
}
