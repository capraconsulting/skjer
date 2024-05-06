export function formatDate(date: string) {
	return new Date(date).toLocaleDateString('no-NO', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function formatTime(date: string) {
	return new Date(date).toLocaleTimeString('no-NO', {
		hour: 'numeric',
		minute: 'numeric'
	});
}
