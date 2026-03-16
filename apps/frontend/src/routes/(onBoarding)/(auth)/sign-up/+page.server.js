import { fail, redirect } from '@sveltejs/kit';
import { ApiError } from '$lib/utils/apiError.js';
import { ROUTES } from '$lib/utils/routes.js';
import {
	registerCustomer,
	registerBusiness
} from '$lib/utils/registrationApi.js';
import { getSessionCookieOptions } from '$lib/utils/authSession.server.js';

export const actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();

		const data = {
			name: String(form.get('name') || '').trim(),
			email: String(form.get('email') || '').trim(),
			password: String(form.get('password') || ''),
			role: String(form.get('role') || '')
				.trim()
				.toLowerCase()
		};

		if (!['customer', 'business'].includes(data.role)) {
			return fail(400, {
				errors: { role: 'Please choose a valid account type.' }
			});
		}

		try {
			const token =
				data.role === 'business'
					? await registerBusiness(data)
					: await registerCustomer(data);

			if (!token) {
				return fail(500, {
					errors: { server: 'Failed to obtain authentication token.' }
				});
			}
			cookies.set('session', token, getSessionCookieOptions(url));
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

		const next =
			data.role === 'business'
				? ROUTES.signUp.business.details
				: ROUTES.signUp.customer.profile;

		throw redirect(303, next);
	}
};
