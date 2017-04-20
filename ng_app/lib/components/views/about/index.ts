import aboutConfig from './about.config.ts';
import aboutComponent from './about.component.ts';
import aboutRun from './about.run.ts';

export default angular.module('structures_site.componants.views.about', [])

.config(aboutConfig)

.component('aboutComponent', new aboutComponent())

.run(aboutRun).name;
