export function validate(schema, data) {
	const result = schema.safeParse(data);

	if (result.success) {
		return { success: true, errors: {} };
	}

	// flatten Zod's error structure into { fieldName: 'first error message' }
	const errors = {};
	for (const issue of result.error.issues) {
		const field = issue.path.join('.'); // handles nested paths too
		if (!errors[field]) {
			errors[field] = issue.message; // keep only the first error per field
		}
	}

	return { success: false, errors };
}
