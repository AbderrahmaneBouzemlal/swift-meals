import { dev } from '$app/environment';

const baseOptions = (url) => ({
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	secure: !dev && url.protocol === 'https:'
});

export function getAccessCookieOptions(url) {
	return {
		...baseOptions(url),
		maxAge: 60 * 5 // 5 minutes (matches backend)
	};
}

export function getRefreshCookieOptions(url) {
	return {
		...baseOptions(url),
		maxAge: 60 * 60 * 24 * 14 // 14 days (matches backend)
	};
}
