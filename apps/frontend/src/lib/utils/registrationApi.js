import { api } from '$lib/utils/api.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';

export async function registerCustomer(data) {
	const response = await api.post(ENDPOINTS.auth.register, {
		email: data.email,
		name: data.name,
		password: data.password,
		role_str: data.role || 'customer'
	});
	return { access: response.access, refresh: response.refresh };
}

export async function login(email, password) {
	const response = await api.post(ENDPOINTS.auth.login, { email, password });
	return { access: response.access, refresh: response.refresh };
}

export async function setUpProfile(data, token) {
	await api.patch(
		ENDPOINTS.profile.customer,
		{
			phone_number: data.phone_number,
			gender: data.gender,
			default_pickup_location: data.default_pickup_location
		},
		{ token }
	);

	if (data.profile_picture instanceof File) {
		const form = new FormData();
		form.append('profile_picture', data.profile_picture);
		await api.patch(ENDPOINTS.profile.picture, form, { token });
	}
}

export async function registerBusiness(data) {
	const response = await api.post(ENDPOINTS.auth.register, {
		email: data.email,
		name: data.name,
		password: data.password,
		role_str: 'business'
	});
	return { access: response?.access, refresh: response?.refresh };
}

export async function setUpBusiness(data, token) {
	await api.patch(
		ENDPOINTS.profile.business,
		{
			restaurant_name: data.restaurant_name,
			phone_number: data.phone_number,
			location: data.location,
			business_type: data.business_type,
			cuisine_type: data.cuisine_type,
			ssm_registration: data.ssm_registration,
			description: data.description,
			gender: data.gender,
			pickup_locations: data.pickup_locations
		},
		{ token }
	);

	if (data.logo instanceof File) {
		const form = new FormData();
		form.append('logo', data.logo);
		await api.patch(ENDPOINTS.profile.picture, form, { token });
	}
}
