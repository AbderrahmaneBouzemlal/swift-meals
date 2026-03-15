export const registration = $state({
	role: '',
	email: '',
	name: '',
	password: '',

	// customer profile
	phone_number: '',
	gender: '',
	default_pickup_location: '',

	// Business profile
	restaurant_name: '',
	location: '',
	cuisine_type: '',
	ssm_registration: '',
	description: '',
	pickup_locations: '',
	logo: null
});

// actions — colocated with the state
export function setRole(role) {
	registration.role = role;
}

export function reset() {
	Object.assign(registration, {
		role: '',
		email: '',
		name: '',
		password: '',
		phone_number: '',
		gender: '',
		default_pickup_location: '',
		restaurant_name: '',
		location: '',
		cuisine_type: '',
		ssm_registration: '',
		description: '',
		pickup_locations: '',
		logo: null
	});
}

export function studentPayload() {
	return {
		email: registration.email,
		name: registration.name,
		password: registration.password,
		phone_number: registration.phone_number,
		gender: registration.gender,
		default_pickup_location: registration.default_pickup_location
	};
}

export function restaurantPayload() {
	return {
		email: registration.email,
		name: registration.name,
		password: registration.password,
		restaurant_name: registration.restaurant_name,
		location: registration.location,
		phone_number: registration.phone_number,
		cuisine_type: registration.cuisine_type,
		ssm_registration: registration.ssm_registration,
		description: registration.description,
		pickup_locations: registration.pickup_locations,
		logo: registration.logo
	};
}
