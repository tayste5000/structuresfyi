import * as ng from 'angular';

import myController from './contribute.controller.ts';

class contributeComponent implements ng.IComponentOptions {
	public bindings : { [index : string] : string};
	public controller : ng.IComponentController;
	public templateUrl : string;

	constructor(){
		this.bindings = {};
		this.controller = myController;
		this.templateUrl = require('./contribute.component.tpl.html');
	}
}

export default contributeComponent;