import { redirect } from '@sveltejs/kit';
import { ROUTES } from '$lib/utils/routes.js';

export function load({ locals }) {
	return {
		user: locals.user
	};
}

export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		throw redirect(303, ROUTES.signIn);
	}
};
