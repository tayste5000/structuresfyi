import presentationConfig from './presentation.config.ts';
import presentationComponent from './presentation.component.ts';
import presentationRun from './presentation.run.ts';

export default angular.module('structures_site.componants.views.presentation', [])

.config(presentationConfig)

.component('presentationComponent', new presentationComponent())

.run(presentationRun).name;
