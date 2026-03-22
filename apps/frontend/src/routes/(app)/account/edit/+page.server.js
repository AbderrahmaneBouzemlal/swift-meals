import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/utils/api.js';
import { ApiError } from '$lib/utils/apiError.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { ROUTES } from '$lib/utils/routes.js';

export function load({ locals }) {
	if (!locals.user) redirect(303, ROUTES.signIn);
	return { user: locals.user };
}

export const actions = {
	default: async ({ request, cookies, locals }) => {
		const token = cookies.get('access');
		if (!token) redirect(303, ROUTES.signIn);

		const form = await request.formData();
		const role = locals.user?.role?.toLowerCase();

		try {
			if (role === 'business') {
				await api.patch(
					ENDPOINTS.profile.business,
					{
						restaurant_name: form.get('restaurant_name'),
						location: form.get('location'),
						phone_number: form.get('phone_number'),
						cuisine_type: form.get('cuisine_type'),
						ssm_registration: form.get('ssm_registration'),
						description: form.get('description'),
						pickup_locations: form.get('pickup_locations')
					},
					{ token }
				);
			} else {
				await api.patch(
					ENDPOINTS.profile.customer,
					{
						student_id: form.get('student_id'),
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
