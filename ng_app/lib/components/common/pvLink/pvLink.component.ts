import * as ng from 'angular';

import myController from './pvLink.controller.ts';

class pvLinkComponent implements ng.IComponentOptions {
	public bindings : { [index : string] : string};
	public controller : ng.IComponentController;
	public templateUrl : string;

	constructor(){
		this.bindings = {
			linkViewer: '&'
		};
		this.controller = myController;
		this.templateUrl = require('./pvLink.component.tpl.html');
	}
}

export default pvLinkComponent;