import { fail } from '@sveltejs/kit';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { api } from '$lib/utils/api.js';

export async function load({ cookies }) {
	const token = cookies.get('access');
	const res = await api.get(ENDPOINTS.menus.list, { token });
	if (!res.results) {
		return {
			menus: [],
			error: res.error || 'Could not load menus'
		};
	}
	return { menus: res.results };
}

export const actions = {
	create: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const description = formData.get('description');
		const is_active = formData.get('is_active') === 'true';
		const token = cookies.get('access');

		const res = await api.post(
			ENDPOINTS.menus.list,
			{ name, description, is_active },
			{ token }
		);

		if (!res.ok) {
			return fail(res.status, {
				action: 'create',
				errors: res.error,
				values: { name, description, is_active }
			});
		}

		return { success: true, action: 'create', menu: res.results };
	},

	delete: async ({ request, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const token = cookies.get('access');

		const res = await api.delete(ENDPOINTS.menus.byId(id), { token });

		if (!res.ok) {
			return fail(res.status, {
				action: 'delete',
				error: res.error || 'Could not delete menu'
			});
		}

		return { success: true, action: 'delete' };
	}
};
