import { browser } from '$app/environment';

export const platform = $state({
	isCapacitor: false,
	isLoaded: false
});

if (browser) {
	// Simple detection: Capacitor usually injects itself.
	// Or we can check for specific protocol/hostname if needed.
	platform.isCapacitor = !!window.Capacitor;
	platform.isLoaded = true;

	// Optional: listen for Capacitor ready if available
	document.addEventListener(
		'deviceready',
		() => {
			platform.isCapacitor = true;
		},
		false
	);
}
