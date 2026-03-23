import { redirect } from '@sveltejs/kit';
import { api } from '$lib/utils/api.js';
import { ENDPOINTS } from '$lib/utils/endpoints.js';
import { ROUTES } from '$lib/utils/routes.js';
import {
	getAccessCookieOptions,
	getRefreshCookieOptions
} from '$lib/utils/authSession.server.js';

function isOnboardingComplete(user) {
	if (!user) return false;

	const role = String(user.role || '').toLowerCase();
	const customerProfile = user.customer_profile;
	const businessProfile = user.business_profile;

	if (role === 'customer') {
		return Boolean(customerProfile);
	}

	if (role === 'business') {
		return Boolean(
			businessProfile?.restaurant_name && businessProfile?.location
		);
	}

	return false;
}

function getOnboardingRoute(user) {
	const role = String(user?.role || '').toLowerCase();
	return role === 'customer'
		? ROUTES.signUp.customer.profile
		: ROUTES.signUp.business.details;
}

export async function handle({ event, resolve }) {
	const pathname = event.url.pathname;
	const access = event.cookies.get('access');
	const refresh = event.cookies.get('refresh');

	event.locals.user = null;

	if (access) {
		try {
			event.locals.user = await api.get(ENDPOINTS.profile.me, {
				token: access
			});
		} catch (err) {
			// Access token might be invalid/expired, try refreshing if we have a refresh token
			if (refresh) {
				try {
					const tokens = await api.post(ENDPOINTS.auth.refresh, { refresh });
					if (tokens?.access) {
						event.cookies.set(
							'access',
							tokens.access,
							getAccessCookieOptions(event.url)
						);
						if (tokens.refresh) {
							event.cookies.set(
								'refresh',
								tokens.refresh,
								getRefreshCookieOptions(event.url)
							);
						}
						event.locals.user = await api.get(ENDPOINTS.profile.me, {
							token: tokens.access
						});
					}
				} catch (refreshErr) {
					// Refresh failed, clear both
					event.cookies.delete('access', { path: '/' });
					event.cookies.delete('refresh', { path: '/' });
				}
			} else {
				event.cookies.delete('access', { path: '/' });
			}
		}
	} else if (refresh) {
		// No access token but we have a refresh token, try to get a new access token
		try {
			const tokens = await api.post(ENDPOINTS.auth.refresh, { refresh });
			if (tokens?.access) {
				event.cookies.set(
					'access',
					tokens.access,
					getAccessCookieOptions(event.url)
				);
				if (tokens.refresh) {
					event.cookies.set(
						'refresh',
						tokens.refresh,
						getRefreshCookieOptions(event.url)
					);
				}
				event.locals.user = await api.get(ENDPOINTS.profile.me, {
					token: tokens.access
				});
			}
		} catch (refreshErr) {
			event.cookies.delete('refresh', { path: '/' });
		}
	}

	const isSignUpRoute = pathname.startsWith('/sign-up');
	const isEntryAuthRoute = pathname === ROUTES.signIn;
	const isAuthRoute = isSignUpRoute || isEntryAuthRoute;

	if (event.locals.user && pathname === ROUTES.signUp.account) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);

		if (onboardingComplete) {
			throw redirect(303, ROUTES.account);
		}
		throw redirect(303, getOnboardingRoute(event.locals.user));
	}

	if (event.locals.user && isEntryAuthRoute) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);
		if (onboardingComplete) {
			throw redirect(303, ROUTES.account);
		}
		throw redirect(303, getOnboardingRoute(event.locals.user));
	}

	if (event.locals.user) {
		const onboardingComplete = isOnboardingComplete(event.locals.user);

		if (!onboardingComplete && !isAuthRoute) {
			throw redirect(303, getOnboardingRoute(event.locals.user));
		}
	} else {
		if (!isAuthRoute && event.url.pathname !== '/') {
			throw redirect(303, ROUTES.signIn);
		}
	}

	return await resolve(event);
}
