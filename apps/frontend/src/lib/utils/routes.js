import { ja } from 'zod/locales';

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
	dashboard: {
		today: '/today',
		history: '/history',
		orders: '/orders',
		slots: '/slots'
	},
	favorites: '/favorites',
	payment: '/payment',
	notifications: '/notifications',
	settings: '/settings',
	account: '/account'
};

export function reviewBackRoute(role) {
	return role === 'business'
		? ROUTES.signUp.business.setup
		: ROUTES.signUp.customer.profile;
}
