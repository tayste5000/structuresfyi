import homeConfig from './home.config.ts';
import homeComponent from './home.component.ts';
import homeRun from './home.run.ts';

export default angular.module('structures_site.componants.views.home', [])

.config(homeConfig)

.component('homeComponent', new homeComponent())

.run(homeRun).name;
