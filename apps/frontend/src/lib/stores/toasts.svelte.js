let toasts = $state([]);

function push(toast) {
	const id = crypto.randomUUID();
	toasts = [...toasts, { id, ...toast }];

	setTimeout(() => {
		dismiss(id);
	}, toast.duration ?? 4000);

	return id;
}

function dismiss(id) {
	toasts = toasts.filter((t) => t.id !== id);
}

export const toastStore = {
	get list() {
		return toasts;
	},
	success: (msg) => push({ type: 'success', message: msg }),
	error: (msg) => push({ type: 'error', message: msg, duration: 6000 }),
	warning: (msg) => push({ type: 'warning', message: msg }),
	dismiss
};
