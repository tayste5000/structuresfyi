import * as ng from 'angular';

class PdbsearchController implements ng.IComponentController{
	public loadedPdb : any;
	public searchFound : boolean;
	public searchFailed : boolean;
	public searchingPdb : boolean;
	public pdbName : string;
	public loadPdb : Function;

	constructor(public $http : ng.IHttpService){}

	searchPdb(pdbSearch : string) : void{
		// Search for a pdbFile from rcsb.org
		const searchUrl = `https://files.rcsb.org/download/${pdbSearch}.pdb`

		this.searchingPdb = true;

		this.$http.get(searchUrl).then(result => {
			this.loadedPdb = result.data;
			this.pdbName = pdbSearch;
			this.searchFound = true;
			this.searchFailed = false;
			this.searchingPdb = false;
		})
		.catch(err => {
			this.searchFound = false;
			this.searchFailed = true;
			this.searchingPdb = false;
		});
	}

	filterName(loadedPdb : string) : string{
		// Get the PDB title

		if(!loadedPdb){return ''}

		// Split into lines
		const pdb_lines = loadedPdb.split('\n');

		let title = '';

		for (var i = 0; i < pdb_lines.length; ++i) {
			if(pdb_lines[i].slice(0,5) == 'TITLE'){
				title = pdb_lines[i].slice(5).trim();
				break;
			}
		}

		return title;
	}

	loadPdbAndReset() : void {
		this.loadPdb({pdb_file: this.loadedPdb, pdb_code: this.pdbName});
		this.searchFailed = false;
		this.searchFound = false;
	}

	// Methods for loading a file manually, not in use right now
	// loadFile(newPdb : string) : void{
	// 	this.pdbFile = newPdb;
	// }

	// changePdb(newPdb : any) : void{
	// 	if(!newPdb){return}

	// 	this.loadingFile = true;

	// 	const reader = new FileReader();

	// 	reader.onload = (ev : Event) : void => {
	// 		this.loadedFile = ev.target.result;
	// 		this.$scope.$apply();
	// 	}

	// 	reader.onloadend = reader.onabort = () : void => {
	// 		this.loadingFile = false;
	// 		this.$scope.$apply();
	// 	}

	// 	reader.readAsText(newPdb, 'utf-8');
	// }
}

PdbsearchController.$inject = ['$http'];

export default PdbsearchController;