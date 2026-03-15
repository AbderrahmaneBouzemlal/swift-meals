const BASE = '/api';

export const ENDPOINTS = {
	auth: {
		register: `${BASE}/auth/register`,
		login: `${BASE}/auth/login`,
		logout: `${BASE}/auth/logout`,
		refresh: `${BASE}/auth/token/refresh`,
		obtain: `${BASE}/auth/token/obtain`
	},
	profile: {
		customer: `${BASE}/profile/customer/update`,
		business: `${BASE}/profile/business/update`,
		picture: `${BASE}/profile/picture`
	},
	business: {
		list: `${BASE}/restaurants`,
		byId: (id) => `${BASE}/business/${id}`
	},
	orders: {
		list: `${BASE}/orders`,
		byId: (id) => `${BASE}/orders/${id}`
	}
};
