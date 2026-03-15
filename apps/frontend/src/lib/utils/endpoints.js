const BASE = '/api';

export const ENDPOINTS = {
	auth: {
		register: `${BASE}/auth/register`,
		login: `${BASE}/auth/login`,
		logout: `${BASE}/auth/logout`,
		refresh: `${BASE}/auth/token/refresh`
	},
	student: {
		profile: `${BASE}/student/profile`
	},
	restaurant: {
		profile: `${BASE}/restaurant/profile`,
		list: `${BASE}/restaurant`,
		byId: (id) => `${BASE}/restaurant/${id}`
	},
	orders: {
		list: `${BASE}/orders`,
		byId: (id) => `${BASE}/orders/${id}`
	}
};
