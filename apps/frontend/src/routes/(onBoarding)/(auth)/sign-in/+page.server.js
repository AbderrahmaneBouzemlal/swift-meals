import { fail, redirect } from '@sveltejs/kit';
import { login } from '$lib/utils/registrationApi.js';
import { ApiError } from '$lib/utils/apiError.js';
import { ROUTES } from '$lib/utils/routes.js';
import { getSessionCookieOptions } from '$lib/utils/authSession.server.js';

export const actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') || '').trim();
		const password = String(form.get('password') || '');

		if (!email || !password) {
			return fail(400, {
				errors: { server: 'Email and password are required.' },
				email
			});
		}

		try {
			const token = await login(email, password);

			if (!token) {
				return fail(400, {
					errors: { server: 'Invalid login credentials' },
					email
				});
			}

			cookies.set('session', token, getSessionCookieOptions(url));
		} catch (err) {
			if (err instanceof ApiError) {
				return fail(400, {
					errors: { server: err.message },
					email
				});
			}
			return fail(500, {
				errors: { server: 'Something unexpected happened.' },
				email
			});
		}

		throw redirect(303, ROUTES.account);
	}
};
