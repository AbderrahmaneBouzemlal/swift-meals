export function formatTime(t) {
	if (!t) return '';
	const [h, m] = t.split(':');
	const hour = parseInt(h);
	return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function formatDays(days, repeat) {
	if (repeat === 'daily') return 'Every day';
	if (!days?.length) return 'No days set';
	if (days.length === 7) return 'Every day';
	if (days.length === 5 && !days.includes(5) && !days.includes(6))
		return 'Weekdays';
	const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	return days.map((d) => LABELS[d]).join(', ');
}
