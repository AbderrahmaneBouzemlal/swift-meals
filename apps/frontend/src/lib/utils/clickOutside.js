export function clickOutside(node, callback) {
	function handle(e) {
		if (!node.contains(e.target)) callback();
	}
	document.addEventListener('click', handle, true);
	return {
		destroy() {
			document.removeEventListener('click', handle, true);
		}
	};
}
