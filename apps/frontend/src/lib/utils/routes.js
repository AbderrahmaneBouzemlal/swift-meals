export const ROUTES = {
	// onboarding
	home: '/',
	chooseRole: '/choose-role',

	// auth
	login: '/login',
	signIn: '/sign-in',

	// registration
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

	// app
	account: '/account',
	orders: '/orders'
};
