export const ROUTES = {
	home: '/',
	chooseRole: '/choose-role',

	login: '/login',
	signIn: '/sign-in',

	signUp: {
		account: '/sign-up',
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
