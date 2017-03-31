import * as ng from 'angular';

import myController from './pdbSearch.controller.ts';

class pdbSearchComponent implements ng.IComponentOptions {
	public bindings : { [index : string] : string};
	public controller : ng.IComponentController;
	public templateUrl : string;

	constructor(){
		this.bindings = {
			loadPdb: '&'
		};
		this.controller = myController;
		this.templateUrl = require('./pdbSearch.component.tpl.html');
	}
}

export default pdbSearchComponent;