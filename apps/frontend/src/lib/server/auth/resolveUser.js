import { api } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoints.js';
import {
	getAccessCookieOptions,
	getRefreshCookieOptions
} from '$lib/server/auth/session.js';

// ─── Internal Helpers ────────────────────────────────────────────────────────

function fetchProfile(token) {
	return api.get(ENDPOINTS.profile.me, { token });
}

async function attemptRefresh(event) {
	const refresh = event.cookies.get('refresh');
	if (!refresh) return null;

	const tokens = await api.post(ENDPOINTS.auth.refresh, { refresh });
	if (!tokens?.access) return null;

	event.cookies.set('access', tokens.access, getAccessCookieOptions(event.url));

	if (tokens.refresh) {
		event.cookies.set(
			'refresh',
			tokens.refresh,
			getRefreshCookieOptions(event.url)
		);
	}

	return tokens.access;
}

function clearTokens(event, { access = false, refresh = false } = {}) {
	if (access) event.cookies.delete('access', { path: '/' });
	if (refresh) event.cookies.delete('refresh', { path: '/' });
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function resolveUser(event) {
	const access = event.cookies.get('access');
	const refresh = event.cookies.get('refresh');

	// No tokens at all — skip everything
	if (!access && !refresh) return null;

	// Try existing access token first
	if (access) {
		try {
			return await fetchProfile(access);
		} catch {
			// Access token is expired or invalid — fall through to refresh
			clearTokens(event, { access: true });
		}
	}

	// No valid access token — try to get one from the refresh token
	if (refresh) {
		try {
			const newAccess = await attemptRefresh(event);
			if (!newAccess) {
				clearTokens(event, { refresh: true });
				return null;
			}
			return await fetchProfile(newAccess);
		} catch {
			// Refresh token is also invalid — clear everything
			clearTokens(event, { access: true, refresh: true });
		}
	}

	return null;
}
