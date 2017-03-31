import * as ng from 'angular';

import myController from './presentation.controller.ts';

class presentationComponent implements ng.IComponentOptions {
	public bindings : { [index : string] : string};
	public controller : ng.IComponentController;
	public templateUrl : string;

	constructor(){
		this.bindings = {};
		this.controller = myController;
		this.templateUrl = require('./presentation.component.tpl.html');
	}
}

export default presentationComponent;