async function getDeviceList() {
	return (await fetch('/api/device-list')).json();
}

async function init() {
	console.log('Home!');

	const {devices} = await getDeviceList();

	const deviceString = devices.map(({name, uuid}) => `${name} (${uuid})`).join(' + ');

	const li = document.createElement('li');
	li.innerText = `Device: ${deviceString}`;
	document.querySelector('.user-data').append(li);
}

export default {init};
