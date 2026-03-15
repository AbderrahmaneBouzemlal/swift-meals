import { api } from '$lib/utils/api.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';

export async function registerCustomer(data) {
	const { token } = await api.post(ENDPOINTS.auth.register, {
		email: data.email,
		name: data.name,
		password: data.password,
		role: 'STUDENT'
	});

	await api.post(
		ENDPOINTS.student.profile,
		{
			student_id: data.student_id,
			phone_number: data.phone_number,
			gender: data.gender,
			default_pickup_location: data.default_pickup_location
		},
		{ token }
	);

	return token;
}

export async function registerBusiness(data) {
	const { token } = await api.post(ENDPOINTS.auth.register, {
		email: data.email,
		name: data.name,
		password: data.password,
		role: 'RESTAURANT'
	});

	const form = new FormData();
	const fields = [
		'restaurant_name',
		'location',
		'phone_number',
		'cuisine_type',
		'ssm_registration',
		'description',
		'pickup_locations',
		'logo'
	];
	for (const key of fields) {
		if (data[key] !== null && data[key] !== undefined) {
			form.append(key, data[key]);
		}
	}

	await api.post(ENDPOINTS.restaurant.profile, form, { token });

	return token;
}
