import { resolveUser } from '$lib/server/auth/resolveUser.js';
import { runGuards } from '$lib/server/guards/index.js';

export async function handle({ event, resolve }) {
	event.locals.user = await resolveUser(event);
	runGuards(event);
	return resolve(event);
}
