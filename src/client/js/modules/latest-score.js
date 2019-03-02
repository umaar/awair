async function init({user, latestScoreURL}) {
	console.log('Latest score!');

	if (!user) {
		return;
	}

	if (latestScoreURL) {
		const rawResponse = await fetch(latestScoreURL);
		const text = await rawResponse.text();
		document.querySelector('.container').insertAdjacentHTML('beforeend', text);
	}
}

export default {init};
