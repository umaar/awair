import home from './modules/home';
import latestScore from './modules/latest-score';

const config = window.awairDashboardConfig;

function init() {
	if (window.location.pathname === '/') {
		home.init(config);
	}

	if (window.location.pathname.startsWith('/device/')) {
		latestScore.init(config);
	}
}

window.addEventListener('load', init);
