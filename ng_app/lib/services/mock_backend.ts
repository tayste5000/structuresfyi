import * as ng from 'angular';
import * as ngDb from 'ng-simpledb';
import * as lodash from 'lodash';
import mockPresentations from './mock_presentations.ts';

/*
MOCK BACKEND CONFIG
*/

function mockBackendConfig(ngSimpleStoreProvider : ngDb.IDbServiceProvider,
	$provide : ng.auto.IProvideService)
{
	// user id for the logged in user
	// DEVELOPMENT ONLY
	const me_id = 1;

	// Set api base url
	ngSimpleStoreProvider.apiUrl = '/api';

	// Set delay of 700 ms
	ngSimpleStoreProvider.setDelay(700, $provide);

	// register resources
	ngSimpleStoreProvider.addResources('presentation', mockPresentations);

	// Add Presentation endpoints
	ngSimpleStoreProvider.addEndpoint('GET', '/api/presentation', ['presentation'], ngSimpleStoreProvider.templates.getAll());
	ngSimpleStoreProvider.addEndpoint('GET', '/api/presentation/:id', ['presentation'], ngSimpleStoreProvider.templates.getOneBy('id'));
	ngSimpleStoreProvider.addEndpoint('PUT', '/api/presentation/:id', ['presentation'], ngSimpleStoreProvider.templates.update());
	ngSimpleStoreProvider.addEndpoint('POST', '/api/presentation', ['presentation'], ngSimpleStoreProvider.templates.create());
	ngSimpleStoreProvider.addEndpoint('GET', '/api/presentation/:id', ['presentation'], ngSimpleStoreProvider.templates.delete());
}

mockBackendConfig.$inject = [
	'ngSimpleStoreProvider',
	'$provide'
];

export {mockBackendConfig as mockBackendConfig};

/*
MOCK BACKEND RUN
*/

function mockBackendRun(ngSimpleStore : ngDB.IDbServiceClass, $httpBackend : ng.IHttpBackendService){
	ngSimpleStore.setup($httpBackend);
}

mockBackendRun.$inject = [
	'ngSimpleStore',
	'$httpBackend'
];

export {mockBackendRun as mockBackendRun};

