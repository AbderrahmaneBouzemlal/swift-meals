import { fail } from '@sveltejs/kit';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { api } from '$lib/utils/api.js';
import { ApiError } from '$lib/utils/apiError.js';

export async function load({ cookies }) {
	const token = cookies.get('access');
	try {
		const res = await api.get(ENDPOINTS.menus.list, { token });
		if (!res?.results) {
			return {
				menus: [],
				error: res?.error || 'Could not load menus'
			};
		}
		return { menus: res.results };
	} catch (err) {
		return {
			menus: [],
			error:
				err instanceof ApiError
					? err.message
					: 'Could not load menus'
		};
	}
}

export const actions = {
	create: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const description = formData.get('description');
		const is_active = formData.get('is_active') === 'true';
		const token = cookies.get('access');

		try {
			const res = await api.post(
				ENDPOINTS.menus.list,
				{ name, description, is_active },
				{ token }
			);

			return { success: true, action: 'create', menu: res.results ?? res };
		} catch (err) {
			if (err instanceof ApiError) {
				const status = err.type === 'validation' ? 400 : 500;
				return fail(status, {
					action: 'create',
					errors:
						err.type === 'validation'
							? err.fieldErrors
							: { server: err.message },
					values: { name, description, is_active }
				});
			}

			return fail(500, {
				action: 'create',
				errors: { server: 'Could not create menu' },
				values: { name, description, is_active }
			});
		}
	},

	delete: async ({ request, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const token = cookies.get('access');

		try {
			await api.delete(ENDPOINTS.menus.byId(id), { token });
			return { success: true, action: 'delete' };
		} catch (err) {
			if (err instanceof ApiError) {
				const status = err.type === 'validation' ? 400 : 500;
				return fail(status, {
					action: 'delete',
					error: err.message
				});
			}

			return fail(500, {
				action: 'delete',
				error: 'Could not delete menu'
			});
		}
	}
};
