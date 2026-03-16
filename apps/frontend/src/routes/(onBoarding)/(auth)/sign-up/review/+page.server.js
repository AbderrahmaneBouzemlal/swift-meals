import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/utils/api.js';
import { ApiError } from '$lib/utils/apiError.js';
import { ENDPOINTS } from '$lib/config/endpoints.js';
import { ROUTES } from '$lib/config/routes.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('session');

		if (!token) {
			redirect(303, ROUTES.signUp.account);
		}

		const form = await request.formData();
		const role = form.get('role');
		const isMultipart = form.get('logo') instanceof File;

		try {
			if (role === 'business') {
				const profileData = new FormData();
				for (const [key, val] of form.entries()) {
					if (key !== 'role' && val !== '' && val !== null) {
						profileData.append(key, val);
					}
				}
				await api.patch(ENDPOINTS.business.profile, profileData, { token });
			} else {
				await api.patch(
					ENDPOINTS.customer.profile,
					{
						phone_number: form.get('phone_number'),
						gender: form.get('gender'),
						default_pickup_location: form.get('default_pickup_location')
					},
					{ token }
				);
			}
		} catch (err) {
			if (err instanceof ApiError) {
				if (err.type === 'validation') {
					return fail(400, { errors: err.fieldErrors });
				}
				return fail(500, { errors: { server: err.message } });
			}
			return fail(500, {
				errors: { server: 'Something unexpected happened.' }
			});
		}

		redirect(303, ROUTES.account);
	}
};
