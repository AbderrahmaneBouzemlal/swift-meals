import { fail, redirect } from '@sveltejs/kit';
import { ApiError } from '$lib/api/error.js';
import { ROUTES } from '$lib/utils/routes.js';
import {
	getAccessCookieOptions,
	getRefreshCookieOptions
} from '$lib/server/auth/session.js';
import { registerUser } from '$lib/api/registration';

export const actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const data = {
			name: String(form.get('name') || '').trim(),
			email: String(form.get('email') || '').trim(),
			password: String(form.get('password') || '')
		};

		try {
			const tokens = await registerUser(data);

			if (!tokens?.access) {
				return fail(500, {
					errors: { server: 'Failed to obtain authentication token.' }
				});
			}

			cookies.set('access', tokens.access, getAccessCookieOptions(url));
			if (tokens.refresh) {
				cookies.set('refresh', tokens.refresh, getRefreshCookieOptions(url));
			}
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.type === 'conflict') {
					return fail(409, {
						errors: { email: 'An account with this email already exists.' }
					});
				}
				if (err.type === 'validation') {
					return fail(400, { errors: err.fieldErrors });
				}
				return fail(500, { errors: { server: err.message } });
			}
			return fail(500, {
				errors: { server: `${err} Something unexpected happened.` }
			});
		}

		const next = ROUTES.signUp.chooseRole;

		throw redirect(303, next);
	}
};
