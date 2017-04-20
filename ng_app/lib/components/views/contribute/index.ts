import contributeConfig from './contribute.config.ts';
import contributeComponent from './contribute.component.ts';
import contributeRun from './contribute.run.ts';

export default angular.module('structures_site.componants.views.contribute', [])

.config(contributeConfig)

.component('contributeComponent', new contributeComponent())

.run(contributeRun).name;
