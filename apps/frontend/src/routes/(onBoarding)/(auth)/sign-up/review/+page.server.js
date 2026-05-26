import { fail, redirect } from '@sveltejs/kit';
import { ApiError } from '$lib/api/error.js';
import { ROUTES } from '$lib/utils/routes.js';
import { setUpProfile, setUpBusiness } from '$lib/api/registration.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access');

		if (!token) {
			throw redirect(303, ROUTES.signIn);
		}

		const form = await request.formData();
		const role = form.get('role');

		try {
			const data = Object.fromEntries(form.entries());

			if (role === 'BUSINESS') {
				await setUpBusiness(data, token);
			} else {
				await setUpProfile(data, token);
			}
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.type === 'validation') {
					return fail(400, {
						errors: err.fieldErrors // already a plain object { field: 'message' }
					});
				}

				return fail(500, {
					errors: {
						server: err.message // string only
					}
				});
			}

			return fail(500, {
				errors: {
					server: err + 'Something unexpected happened. Please try again.'
				}
			});
		}

		cookies.delete('signup_role', { path: '/' });
		throw redirect(303, ROUTES.account);
	}
};
