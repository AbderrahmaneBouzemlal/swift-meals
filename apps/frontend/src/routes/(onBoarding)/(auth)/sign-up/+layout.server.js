export function load({ cookies, locals }) {
	const signupRole = cookies.get('signup_role');
	return {
		signupRole,
		user: locals.user
	};
}
