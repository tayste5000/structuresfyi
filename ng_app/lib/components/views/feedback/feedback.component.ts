import * as ng from 'angular';

import myController from './feedback.controller.ts';

class feedbackComponent implements ng.IComponentOptions {
	public bindings : { [index : string] : string};
	public controller : ng.IComponentController;
	public templateUrl : string;

	constructor(){
		this.bindings = {};
		this.controller = myController;
		this.templateUrl = require('./feedback.component.tpl.html');
	}
}

export default feedbackComponent;