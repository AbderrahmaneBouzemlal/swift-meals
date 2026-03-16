import { dev } from '$app/environment';

export function getSessionCookieOptions(url) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev && url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 7
	};
}
