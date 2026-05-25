export class ApiError extends Error {
	constructor(type, message, fields = {}) {
		super(message);
		this.type = type;
		this.fields = fields;
	}

	get fieldErrors() {
		const out = {};
		for (const [key, messages] of Object.entries(this.fields)) {
			out[key] = Array.isArray(messages) ? messages[0] : messages;
		}
		return out;
	}

	static fromResponse(status, body) {
		switch (status) {
			case 400:
				return new ApiError('validation', 'Please check your details.', body);
			case 401:
				return new ApiError('auth', 'Session expired. Please sign in again.');
			case 403:
				return new ApiError('auth', 'You do not have permission to do this.');
			case 409:
				return new ApiError(
					'conflict',
					body?.detail ?? 'This account already exists.'
				);
			case 429:
				return new ApiError(
					'rate_limit',
					'Too many attempts. Please wait a moment.'
				);
			case 500:
			case 502:
			case 503:
				return new ApiError('server', 'Something went wrong on our end.');
			default:
				return new ApiError(
					'unknown',
					body?.detail ?? `Unexpected error (${status})`
				);
		}
	}
}
