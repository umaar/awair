const express = require('express');
const config = require('config');
const got = require('got');

const router = express.Router();

const awairClientID = config.get('awairClientID');
const awairClientSecret = config.get('awairClientSecret');

router.get('/', async (req, res) => {
	const renderObject = {
		messages: req.flash('messages'),
		text: 'hello world'
	};

	res.render('index', renderObject);
});

router.get('/device/:deviceID', async (req, res) => {
	const deviceID = req.params.deviceID;
	console.log({deviceID});
	const renderObject = {
		messages: req.flash('messages'),
		text: 'hello world'
	};

	res.render('index', renderObject);
});

router.get('/auth/logout', (req, res) => {
	req.flash('messages', {
		status: 'success',
		value: 'You have been logged out'
	});

	delete req.session.awair;

	return res.redirect('/');
});

router.get('/auth/login', (req, res) => {
	const awairOauthStep1APIBasePath = config.get('awairOauthStep1APIBasePath');
	const domain = config.get('domain');

	const queryString = {
		redirect_uri: `${domain}/auth/oauth2Success`,
		client_id: awairClientID,
		response_type: 'code',
		scope: '',
		state: 'test-state-123'
	};

	const params = new URLSearchParams(queryString);
	const url = `${awairOauthStep1APIBasePath}/?${params.toString()}`;
	res.redirect(url);
});

async function getToken(code) {
	const awairOauthStep2APIBasePath = config.get('awairOauthStep2APIBasePath');

	const tokenPayload = {
		client_id: awairClientID,
		client_secret: awairClientSecret,
		grant_type: 'authorization_code',
		code
	};

	const response = await got(awairOauthStep2APIBasePath, {
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(tokenPayload),
		responseType: 'json'
	});

	if (response && response.body) {
		const data = JSON.parse(response.body);
		const accessToken = data.access_token;
		console.log('Token retrieved');
		return accessToken;
	}

	console.log('Nooooo. Cannot get the token', response.body);
}

async function queryGraphQL({query: rawQuery, token}) {
	const awairGraphQLBasePath = config.get('awairGraphQLBasePath');
	const queryPayload = `query { ${rawQuery} }`;

	console.time('Awair API Response Time');
	const response = await got(awairGraphQLBasePath, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
			accept: 'application/json'
		},
		body: JSON.stringify({query: queryPayload}),
		responseType: 'json'
	});
	console.timeEnd('Awair API Response Time');

	if (response && response.body) {
		const parsedBody = JSON.parse(response.body);

		return parsedBody.data;
	}

	console.log('\n\nError executing the GraphQL query', response.body);
}

async function getUserData(token) {
	const queryPayload = `
		User {
			id,
			email,
			name {
				firstName
				lastName
			}
		}
	`;

	const response = await queryGraphQL({
		query: queryPayload,
		token
	});

	return response.User;
}

async function getDeviceList(token) {
	const queryPayload = `
		Devices {
		  devices {
		    uuid,
		    deviceType,
		    name,
		    deviceId
		  }
		}
	`;

	let response;

	try {
		response = await queryGraphQL({
			query: queryPayload,
			token
		});
	} catch (err) {
		console.log('\nThere was an error: ', err);
	}

	return response.Devices;
}

router.get('/auth/oauth2Success', async (req, res) => {
	const code = req.query.code;

	if (!code) {
		req.flash('messages', {
			status: 'danger',
			value: 'Oauth was unsuccessful'
		});

		return res.redirect('/');
	}

	const accessToken = await getToken(code);
	const data = await getUserData(accessToken);
	const {devices} = await getDeviceList(accessToken);

	req.flash('messages', {
		status: 'success',
		value: 'Connected to awair successfully'
	});

	req.session.awair = {
		accessToken,
		...data,
		devices,
		lastUpdated: new Date()
	};

	res.redirect('/');
});

router.get('/account/refresh', async (req, res) => {
	console.log('Refreshing account details');

	const accessToken = req.session.awair.accessToken;

	const data = await getUserData(accessToken);
	const {devices} = await getDeviceList(accessToken);

	req.session.awair = {
		accessToken,
		...data,
		devices,
		lastUpdated: new Date()
	};

	req.flash('messages', {
		status: 'success',
		value: 'Details updated successfully'
	});

	return res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if (req.session.awair && req.session.awair.accessToken) {
		return next();
	}

	const errorString = 'Error: Tried to call a protected route from a logged out user';
	res.status(401).send({error: errorString});
}

module.exports = router;
