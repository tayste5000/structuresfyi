//main dependencies
import * as angular from 'angular';
import 'angular-ui-router';
import 'angular-resource/angular-resource.js';

//styles
import './styles/bootstrap/_bootstrap.scss';
import './styles/display.css';

//components
import Components from './components/index.ts';

//services
import Services from './services/index.ts';

const ngFileUpload = require('ng-file-upload');

angular.module('structures_site', [
	'ui.router',
	'ngResource',
	ngFileUpload,
	Components,
	Services
]);
