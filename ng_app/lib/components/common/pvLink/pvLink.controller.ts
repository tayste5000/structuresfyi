import * as ng from 'angular';
import * as pv from 'bio-pv/bio-pv.min.js';

class PvlinkController implements ng.IComponentController{
	constructor( public $element : any){}

	$postLink(){
		const viewer = pv.Viewer(this.$element[0], {
		  width: 'auto',
		  height: 500,
		  antialias: true,
		  quality : 'medium'
		});

		this.linkViewer({viewer: viewer});
	}
}

PvlinkController.$inject = ['$element'];

export default PvlinkController;