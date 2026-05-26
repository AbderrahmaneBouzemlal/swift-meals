import { fail, redirect } from '@sveltejs/kit';
import { ROUTES } from '$lib/utils/routes.js';

// choose-role page: validates role selection and redirects to profile setup
export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const role = String(form.get('role') || '').trim();

		if (!['CUSTOMER', 'BUSINESS'].includes(role)) {
			return fail(400, {
				errors: { role: 'Please choose a valid account type.' }
			});
		}

		// Store role in cookies for later use
		cookies.set('signup_role', role, {
			path: '/sign-up',
			maxAge: 3600, // 1 hour
			httpOnly: true,
			sameSite: 'lax'
		});

		// Redirect to profile setup based on role
		const next =
			role === 'BUSINESS'
				? ROUTES.signUp.business.details
				: ROUTES.signUp.customer.profile;

		throw redirect(303, next);
	}
};
