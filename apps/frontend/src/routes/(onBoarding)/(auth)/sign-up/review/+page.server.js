import { fail, redirect } from '@sveltejs/kit';
import { ApiError } from '$lib/utils/apiError.js';
import { ROUTES } from '$lib/utils/routes.js';
import { setUpProfile, setUpBusiness } from '$lib/utils/registrationApi.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('session');

		if (!token) {
			throw redirect(303, ROUTES.signUp.account);
		}

		const form = await request.formData();
		const role = form.get('role');

		try {
			const data = Object.fromEntries(form.entries());

			if (role === 'business') {
				await setUpBusiness(data, token);
			} else {
				await setUpProfile(data, token);
			}
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.type === 'validation') {
					return fail(400, { errors: err.fieldErrors });
				}
				return fail(500, { errors: { server: err.message } });
			}
			return fail(500, {
				errors: { server: 'Something unexpected happened.', err }
			});
		}

		throw redirect(303, ROUTES.account);
	}
};
