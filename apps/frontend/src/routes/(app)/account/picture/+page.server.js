// +page.server.js
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
	upload: async ({ request, cookies, locals }) => {
		const token = cookies.get('access');
		if (!token) redirect(303, ROUTES.signIn);

		const form = await request.formData();
		const file = form.get('picture');

		if (!file || file.size === 0) {
			return fail(400, { errors: { picture: 'Please select a photo.' } });
		}

		const allowed = ['image/jpeg', 'image/png', 'image/webp'];
		if (!allowed.includes(file.type)) {
			return fail(400, {
				errors: { picture: 'Only JPG, PNG or WebP images are allowed.' }
			});
		}

		if (file.size > 5 * 1024 * 1024) {
			return fail(400, { errors: { picture: 'Image must be under 5MB.' } });
		}

		try {
			const formData = new FormData();
			// field name matches what Django expects per role
			const fieldName =
				locals.user.role?.toLowerCase() === 'business'
					? 'logo'
					: 'profile_picture';

			formData.append(fieldName, file);
			await api.patch(ENDPOINTS.profile.picture, formData, { token });
		} catch (err) {
			if (err instanceof ApiError) {
				return fail(500, { errors: { server: err.message } });
			}
			return fail(500, {
				errors: { server: 'Upload failed. Please try again.' }
			});
		}

		redirect(303, ROUTES.account);
	},

	remove: async ({ cookies }) => {
		const token = cookies.get('session');
		if (!token) redirect(303, ROUTES.signIn);

		try {
			await api.delete(ENDPOINTS.profile.picture, { token });
		} catch (err) {
			return fail(500, { errors: { server: 'Could not remove photo.' } });
		}

		redirect(303, ROUTES.account);
	}
};
