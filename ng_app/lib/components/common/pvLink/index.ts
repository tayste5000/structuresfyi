import pvLinkConfig from './pvLink.config.ts';
import pvLinkComponent from './pvLink.component.ts';
import pvLinkRun from './pvLink.run.ts';

export default angular.module('structures_site.componants.views.pvLink', [])

.config(pvLinkConfig)

.component('pvLinkComponent', new pvLinkComponent())

.run(pvLinkRun).name;
