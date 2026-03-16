import { api } from '$lib/utils/api.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';

export async function registerCustomer(data) {
	const { token } = await api.post(ENDPOINTS.auth.register, {
		email: data.email,
		name: data.name,
		password: data.password,
		role: 'CUSTOMER'
	});
	return token;
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

	if (data.profilePicture instanceof File) {
		const form = new FormData();
		form.append(data.role === 'logo', data.profilePicture);
		await api.patch(ENDPOINTS.profile.picture, form, { token });
	}
}

export async function registerBusiness(data) {
	const { token } = await api.post(ENDPOINTS.auth.register, {
		email: data.email,
		name: data.name,
		password: data.password,
		role: 'BUSINESS'
	});
	return token;
}
export async function setUpBusiness(data, token) {
	await api.patch(
		ENDPOINTS.profile.business,
		{
			restaurant_name: data.restaurant_name,
			phone_number: data.phone_number,
			location: data.location,
			cuisine_type: data.cuisine_type,
			ssm_registration: data.ssm_registration,
			description: data.description,
			gender: data.gender,
			pickup_location: data.pickup_location
		},
		{ token }
	);

	if (data.logo instanceof File) {
		const form = new FormData();
		form.append(data.role === 'logo', data.logo);
		await api.patch(ENDPOINTS.profile.picture, form, { token });
	}
}
