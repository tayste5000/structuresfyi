//main dependencies
import * as angular from 'angular';
import 'angular-ui-router';
import 'angular-resource/angular-resource.js';
import 'angular-mocks';

//database service
import 'ng-simpledb';

//styles
import './styles/bootstrap/_bootstrap.scss';
import './styles/display.css';

//components
import Components from './components/index.ts';

//services
import Services from './services/index.ts';

//MOCK BACKEND: FOR DEVELOPMENT ONLY
import {mockBackendRun, mockBackendConfig} from './services/mock_backend.ts';

const ngFileUpload = require('ng-file-upload');

angular.module('structures_site', [
	'ui.router',
	'ngResource',
	//MOCK BACKEND: FOR DEVELOPMENT ONLY 
	'ngMockE2E',
	'ngSimpleDb',
	ngFileUpload,
	Components,
	Services
])
//MOCK BACKEND: FOR DEVELOPMENT ONLY
.config(mockBackendConfig)
.run(mockBackendRun);
