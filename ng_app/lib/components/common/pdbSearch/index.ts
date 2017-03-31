import pdbSearchConfig from './pdbSearch.config.ts';
import pdbSearchComponent from './pdbSearch.component.ts';
import pdbSearchRun from './pdbSearch.run.ts';

export default angular.module('structures_site.componants.views.pdbSearch', [])

.config(pdbSearchConfig)

.component('pdbSearchComponent', new pdbSearchComponent())

.run(pdbSearchRun).name;
