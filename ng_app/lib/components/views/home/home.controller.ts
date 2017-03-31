import * as ng from 'angular';
import pdb_file from './test_pdb.ts';

interface galleryItem {
	id: number;
	code: string;
	title: string;
	states: Array<any>;
}

class HomeController implements ng.IComponentController{
	public galleryItems : Array<galleryItem>;

	constructor(public $http : ng.IHttpService){}

	$onInit(){
		this.$http.get('/api/presentation')
			.then(response => {
				this.galleryItems = response.data;
			})
			.catch(response => {
				console.error(response)
			});
	}
}

HomeController.$inject = ['$http'];

export default HomeController;