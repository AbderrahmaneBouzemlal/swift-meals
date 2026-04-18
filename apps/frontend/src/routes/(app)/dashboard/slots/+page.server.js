import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/utils/api.js';
import { ApiError } from '$lib/utils/apiError.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { ROUTES } from '$lib/utils/routes.js';

export async function load({ locals, cookies }) {
	if (!locals.user || locals.user.role?.toLowerCase() !== 'BUSINESS') {
		redirect(303, ROUTES.account);
	}

	const access = cookies.get('access');

	try {
		const [slots, menus] = await Promise.all([
			api.get(ENDPOINTS.slots.list, { token: access }),
			api.get(ENDPOINTS.menus.list, { token: access })
		]);
		return {
			slots: slots.results,
			menus: menus.results,
			user: locals.user
		};
	} catch {
		return {
			slots: { results: [] },
			menus: { results: [] },
			user: locals.user
		};
	}
}

export const actions = {
	create: async ({ request, cookies }) => {
		const access = cookies.get('access');
		const form = await request.formData();

		try {
			let response = await api.post(
				ENDPOINTS.slots.list,
				buildSlotPayload(form),
				{ token: access }
			);
			return { success: true, action: 'create' };
		} catch (err) {
			return handleError(err, 'create');
		}
	},
	update: async ({ request, cookies }) => {
		const access = cookies.get('access');
		const form = await request.formData();
		const id = form.get('id');

		try {
			let response = await api.patch(
				ENDPOINTS.slots.byId(id),
				buildSlotPayload(form),
				{
					token: access
				}
			);

			return { success: true, action: 'update' };
		} catch (err) {
			return handleError(err, 'update');
		}
	},

	toggle: async ({ request, cookies }) => {
		const access = cookies.get('access');
		const form = await request.formData();
		const id = form.get('id');
		const current = form.get('is_active') === 'true';

		try {
			await api.patch(
				ENDPOINTS.slots.byId(id),
				{ is_active: !current },
				{ token: access }
			);
			return { success: true, action: 'toggle' };
		} catch (err) {
			return handleError(err, 'toggle');
		}
	},

	delete: async ({ request, cookies }) => {
		const access = cookies.get('access');
		const form = await request.formData();
		const id = form.get('id');

		try {
			await api.delete(ENDPOINTS.slots.byId(id), { token: access });
			return { success: true, action: 'delete' };
		} catch (err) {
			return handleError(err, 'delete');
		}
	}
};

function buildSlotPayload(form) {
	const repeat = form.get('repeat');

	return {
		name: form.get('name'),
		start_time: form.get('start_time'),
		end_time: form.get('end_time'),
		repeat,
		// days is a JSON array — only relevant for weekly
		days: repeat === 'weekly' ? JSON.parse(form.get('days') || '[]') : [],
		max_orders: form.get('max_orders') || null,
		order_cutoff: Number(form.get('order_cutoff')) || 30,
		is_active: form.get('is_active') === 'true',
		menu_id: form.get('menu_id') || null
	};
}

function handleError(err, action) {
	if (err instanceof ApiError) {
		if (err.type === 'validation') {
			return fail(400, { errors: err.fieldErrors, action });
		}
		return fail(500, { errors: { server: err.message }, action });
	}
	return fail(500, {
		errors: { server: 'Something unexpected happened.' },
		action
	});
}
