async function getDeviceList() {
	return (await fetch('/api/device-list')).json();
}

async function init({user}) {
	console.log('Home!');

	if (!user) {
		return;
	}
}

export default {init};
