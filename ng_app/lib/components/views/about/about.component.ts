import * as ng from 'angular';

import myController from './about.controller.ts';

class aboutComponent implements ng.IComponentOptions {
	public bindings : { [index : string] : string};
	public controller : ng.IComponentController;
	public templateUrl : string;

	constructor(){
		this.bindings = {};
		this.controller = myController;
		this.templateUrl = require('./about.component.tpl.html');
	}
}

export default aboutComponent;