import { error, fail } from '@sveltejs/kit';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { api } from '$lib/utils/api.js';

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

		const res = await api.patch(
			ENDPOINTS.menus.byId(params.id),
			{ name, description, is_active },
			{ token }
		);

		if (!res.ok)
			return fail(res.status, { action: 'updateMenu', errors: res.error });
		return { success: true, action: 'updateMenu', menu: res };
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

		const res = itemId
			? await api.patch(url, payload, { token })
			: await api.post(url, payload, { token });

		if (!res.ok)
			return fail(res.status, { action: 'upsertItem', errors: res.error });
		return { success: true, action: 'upsertItem', item: res };
	},

	deleteItem: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const itemId = formData.get('id');
		const token = cookies.get('access');

		const res = await api.delete(ENDPOINTS.menus.itemById(params.id, itemId), {
			token
		});

		if (!res.ok) {
			return fail(res.status, {
				action: 'deleteItem',
				error: res.error || 'Could not delete item'
			});
		}

		return { success: true, action: 'deleteItem' };
	}
};
