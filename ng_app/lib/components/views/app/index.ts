import appConfig from './app.config.ts';
import appComponent from './app.component.ts';
import appRun from './app.run.ts';

export default angular.module('structures_site.componants.views.app', [])

.config(appConfig)

.component('appComponent', new appComponent())

.run(appRun).name;
