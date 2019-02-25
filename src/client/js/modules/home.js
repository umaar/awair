async function getDeviceList() {
	return (await fetch('/api/device-list')).json();
}

async function init(config) {
	console.log('Home!');

	if (!config.user) {
		return;
	}
}

export default {init};
