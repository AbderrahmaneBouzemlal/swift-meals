import { redirect } from '@sveltejs/kit';
import { ROUTES } from '$lib/utils/routes.js';
import { api } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoints.js';

export async function load({ locals, cookies }) {
	const access = cookies.get('access');
	const slots = await api.get(ENDPOINTS.slots.list, { token: access });
	if (slots.count > 0) {
		await api.patch(
			ENDPOINTS.profile.business,
			{ is_live: true },
			{ token: access }
		);
	}
	return {
		user: locals.user
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('access', { path: '/' });
		cookies.delete('refresh', { path: '/' });
		cookies.delete('signup_role', { path: '/' });
		throw redirect(303, ROUTES.signIn);
	}
};
