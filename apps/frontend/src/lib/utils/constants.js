import { registration } from '$lib/stores/registration.svelte';
export const BUSINESS_SIGNUP_STEPS = ['Account', 'Details', 'Setup', 'Review'];
export const CUSTOMER_SIGNUP_STEPS = ['Account', 'Profile', 'Review'];
export const GENDER_OPTIONS = ['Male', 'Female'];
export const BUSINESS_TYPE = ['Student Seller', 'Restaurant'];
export const DAYS = [
	{ value: 0, label: 'Mon' },
	{ value: 1, label: 'Tue' },
	{ value: 2, label: 'Wed' },
	{ value: 3, label: 'Thu' },
	{ value: 4, label: 'Fri' },
	{ value: 5, label: 'Sat' },
	{ value: 6, label: 'Sun' }
];

export const REPEAT_OPTIONS = [
	{ value: 'daily', label: 'Every day' },
	{ value: 'weekly', label: 'Selected days' }
];
