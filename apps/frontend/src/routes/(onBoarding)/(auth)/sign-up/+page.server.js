// src/routes/(auth)/sign-up/account/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/utils/api.js';
import { ApiError } from '$lib/utils/apiError.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { ROUTES } from '$lib/utils/routes.js';
import { registerCustomer } from '$lib/utils/registrationApi';
import { registration } from '$lib/stores/registration.svelte.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();

		const data = {
			name: form.get('name'),
			email: form.get('email'),
			password: form.get('password'),
			role: form.get('role')
		};

		try {
			const token = await registerCustomer(data);

			cookies.set('session', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});
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

		redirect(303, next);
	}
};
