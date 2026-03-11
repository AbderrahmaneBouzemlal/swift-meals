import { writable } from 'svelte/store';

export const registrationData = writable({
	// Step 1 — shared
	email: '',
	name: '',
	password: '',

	// Student profile
	student_id: '',
	phone_number: '',
	gender: '',
	default_pickup_location: '',

	// Restaurant profile
	restaurant_name: '',
	location: '',
	cuisine_type: '',
	ssm_registration: '',
	description: '',
	pickup_locations: '',
	logo: null
});
