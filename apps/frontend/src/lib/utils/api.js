import { ApiError } from './apiError';

async function request(url, { method = 'GET', token, data, params } = {}) {
	// append query params if provided
	const fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url;

	// decide how to serialize the body
	let body;
	let headers = {};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	if (data instanceof FormData) {
		body = data;
	} else if (data !== undefined) {
		body = JSON.stringify(data);
		headers['Content-Type'] = 'application/json';
	}

	let res;
	try {
		res = await fetch(fullUrl, { method, headers, body });
	} catch {
		throw new ApiError('network', 'No internet connection. Please try again.');
	}

	if (res.status === 204) return null;

	let json;
	try {
		json = await res.json();
	} catch {
		throw new ApiError('server', `Server error (${res.status})`);
	}

	if (!res.ok) {
		throw ApiError.fromResponse(res.status, json);
	}

	return json;
}

export const api = {
	get: (url, options) => request(url, { ...options, method: 'GET' }),
	post: (url, data, options) =>
		request(url, { ...options, method: 'POST', data }),
	put: (url, data, options) =>
		request(url, { ...options, method: 'PUT', data }),
	patch: (url, data, options) =>
		request(url, { ...options, method: 'PATCH', data }),
	delete: (url, options) => request(url, { ...options, method: 'DELETE' })
};
