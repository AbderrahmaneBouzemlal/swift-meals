import { validate } from './validate.js';

export function useFormValidation(schema, getData) {
	let touched = $state({});
	let errors = $state({});

	$effect(() => {
		const result = schema.safeParse(getData());

		if (result.success) {
			errors = {};
			return;
		}

		const allErrors = {};
		for (const issue of result.error.issues) {
			const field = issue.path[0];
			if (!allErrors[field]) allErrors[field] = issue.message;
		}

		const visible = {};
		for (const [field, message] of Object.entries(allErrors)) {
			if (touched[field]) visible[field] = message;
		}

		errors = visible;
	});

	function touch(field) {
		touched = { ...touched, [field]: true };
	}

	function touchAll(fields) {
		console.log(fields);
		touched = Object.fromEntries(fields?.map((f) => [f, true]));
	}

	function submitValidate(fields) {
		touchAll(fields);
		const result = schema.safeParse(getData());
		if (!result.success) {
			const allErrors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0];
				if (!allErrors[field]) allErrors[field] = issue.message;
			}
			errors = allErrors;
			return false;
		}
		return true;
	}

	return {
		get errors() {
			return errors;
		},
		touch,
		submitValidate
	};
}
