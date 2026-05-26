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
		today: '/dashboard/today',
		history: '/dashboard/history',
		orders: '/dashboard/orders',
		slots: '/dashboard/slots',
		menu: {
			list: '/dashboard/menu',
			byId: (id) => `/dashboard/menu/${id}`
		}
	},
	favorites: '/favorites',
	payment: '/payment',
	notifications: '/notifications',
	settings: '/settings',
	account: '/account',
	byparam: (route, param) => `${route}?${param}`
};

export function reviewBackRoute(role) {
	return role === 'BUSINESS'
		? ROUTES.signUp.business.setup
		: ROUTES.signUp.customer.profile;
}
