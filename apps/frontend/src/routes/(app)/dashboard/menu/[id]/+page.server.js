import { error, fail } from '@sveltejs/kit';
import { ENDPOINTS } from '$lib/api/endpoints.js';
import { api } from '$lib/api/client.js';
import { ApiError } from '$lib/api/error.js';

export async function load({ params, cookies }) {
	const token = cookies.get('access');
	const [menuRes, itemsRes] = await Promise.all([
		api.get(ENDPOINTS.menus.byId(params.id), { token }),
		api.get(ENDPOINTS.menus.items(params.id), { token })
	]);

	if (!menuRes) {
		throw error(menuRes.status, menuRes.error || 'Menu not found');
	}

	const menu = menuRes;
	const items = itemsRes && itemsRes.results ? itemsRes : { results: [] };

	return { menu, items: items.results || [] };
}

export const actions = {
	updateMenu: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const description = formData.get('description');
		const is_active = formData.get('is_active') === 'true';
		const token = cookies.get('access');

		try {
			const res = await api.patch(
				ENDPOINTS.menus.byId(params.id),
				{ name, description, is_active },
				{ token }
			);

			return { success: true, action: 'updateMenu', menu: res };
		} catch (err) {
			if (err instanceof ApiError) {
				return fail(err.type === 'validation' ? 400 : 500, {
					action: 'updateMenu',
					errors:
						err.type === 'validation'
							? err.fieldErrors
							: { server: err.message }
				});
			}

			return fail(500, {
				action: 'updateMenu',
				errors: { server: 'Could not update menu' }
			});
		}
	},

	upsertItem: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const itemId = formData.get('id');
		const name = formData.get('name');
		const description = formData.get('description');
		const price = formData.get('price');
		const is_available = formData.get('is_available') === 'true';
		const image = formData.get('image');
		const token = cookies.get('access');

		const payload = new FormData();
		payload.append('name', name);
		payload.append('description', description);
		payload.append('price', price);
		payload.append('is_available', is_available);
		if (image && image.size > 0) payload.append('image', image);

		const url = itemId
			? ENDPOINTS.menus.itemById(params.id, itemId)
			: ENDPOINTS.menus.items(params.id);

		try {
			const res = itemId
				? await api.patch(url, payload, { token })
				: await api.post(url, payload, { token });

			return { success: true, action: 'upsertItem', item: res };
		} catch (err) {
			if (err instanceof ApiError) {
				return fail(err.type === 'validation' ? 400 : 500, {
					action: 'upsertItem',
					errors:
						err.type === 'validation'
							? err.fieldErrors
							: { server: err.message }
				});
			}

			return fail(500, {
				action: 'upsertItem',
				errors: { server: 'Could not save item' }
			});
		}
	},

	deleteItem: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const itemId = formData.get('id');
		const token = cookies.get('access');

		try {
			await api.delete(ENDPOINTS.menus.itemById(params.id, itemId), {
				token
			});

			return { success: true, action: 'deleteItem' };
		} catch (err) {
			if (err instanceof ApiError) {
				return fail(err.type === 'validation' ? 400 : 500, {
					action: 'deleteItem',
					error: err.message
				});
			}

			return fail(500, {
				action: 'deleteItem',
				error: 'Could not delete item'
			});
		}
	}
};
