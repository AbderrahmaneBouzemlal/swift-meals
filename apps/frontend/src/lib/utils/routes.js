export const ROUTES = {
	home: '/',

	signIn: '/sign-in',

	signUp: {
		account: '/sign-up',
		chooseRole: '/sign-up/choose-role',

		customer: {
			profile: '/sign-up/customer/profile'
		},
		business: {
			details: '/sign-up/business/details',
			setup: '/sign-up/business/setup'
		},
		review: '/sign-up/review'
	},

	account: '/account',
	orders: '/orders'
};

export function reviewBackRoute(role) {
	return role === 'business'
		? ROUTES.signUp.business.setup
		: ROUTES.signUp.customer.profile;
}
