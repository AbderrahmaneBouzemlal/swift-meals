import { z } from 'zod';

// ── shared ────────────────────────────────────────────────────
export const accountSchema = z
	.object({
		name: z
			.string()
			.min(1, 'Name is required')
			.min(2, 'Name must be at least 2 characters'),

		email: z
			.string()
			.min(1, 'Email is required')
			.email('Enter a valid email address'),

		password: z
			.string()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),

		confirmPassword: z.string().min(1, 'Please confirm your password')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'] // error appears on confirmPassword field
	});

// ── customer ──────────────────────────────────────────────────
export const customerProfileSchema = z.object({
	student_id: z
		.string()
		.min(1, 'Student ID is required')
		.max(20, 'Student ID must be under 20 characters'),

	phone_number: z
		.string()
		.regex(/^\+?[\d\s\-]{7,15}$/, 'Enter a valid phone number')
		.or(z.literal(''))
		.optional(),

	gender: z.enum(['Male', 'Female', 'Other', '']).optional(),

	default_pickup_location: z
		.string()
		.max(150, 'Location must be under 150 characters')
		.optional()
});

// ── business details ──────────────────────────────────────────
export const businessDetailsSchema = z.object({
	restaurant_name: z
		.string()
		.min(1, 'Restaurant name is required')
		.max(150, 'Restaurant name must be under 150 characters'),

	location: z
		.string()
		.min(1, 'Location is required')
		.max(200, 'Location must be under 200 characters'),

	phone_number: z
		.string()
		.regex(/^\+?[\d\s\-]{7,15}$/, 'Enter a valid phone number')
		.or(z.literal(''))
		.optional(),

	cuisine_type: z
		.string()
		.max(100, 'Cuisine type must be under 100 characters')
		.optional(),

	ssm_registration: z
		.string()
		.max(50, 'SSM number must be under 50 characters')
		.optional()
});

// ── business setup ────────────────────────────────────────────
export const businessSetupSchema = z.object({
	description: z
		.string()
		.max(500, 'Description must be under 500 characters')
		.optional(),

	pickup_locations: z.string().optional(),

	logo: z
		.instanceof(File)
		.refine((file) => file.size <= 5 * 1024 * 1024, 'Logo must be under 5MB')
		.refine(
			(file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
			'Logo must be a JPG, PNG or WebP image'
		)
		.optional()
		.nullable()
});
