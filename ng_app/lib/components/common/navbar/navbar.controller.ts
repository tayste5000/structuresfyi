import * as ng from 'angular';

import { navbarItem } from '../../../utils/interfaces.ts';


class navbarCtrl implements ng.IComponentController{
	public navbarItems : Array<navbarItem>;
	public collapsed : boolean;

	constructor(){
		this.collapsed = true;
	}
}

export default navbarCtrl;