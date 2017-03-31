import * as ng from 'angular';
import * as pv from 'bio-pv/bio-pv.min.js';
import * as lodash from 'lodash';

interface ViewerCamera{
	zoom : number;
	center : Array<number>;
	rotation : Array<number>;
}

interface ViewerState{
	camera : ViewerCamera;
	message : string;
	residueSelector : any;
	id : number;
}

interface ResidueSelection{
	chain : string;
	residue : {name : string, index : number};
}

interface presentation {
	id: number;
	code: string;
	title: string;
	states: Array<ViewerState>;
}

class PresentationController implements ng.IComponentController{
	public presentation : presentation;
	public pdbFile : string;
	public pdbStructure : any;
	public pdbLoaded : boolean;
	public viewer : any;
	public viewerStructure : any;
	public activeState : any;
	public selectedChain : any;
	public index : number;
	public started : boolean;
	public showInfo : boolean;

	constructor(public $http : ng.IHttpService, public $stateParams : ng.ui.IStateParamsService){}

	$onInit(){
		this.showInfo = false;
		this.index = 0;
		this.started = false;

		this.$http.get(`/api/presentation/${this.$stateParams.id}`)
			.then(response => {
				this.presentation = response.data;
				this.fetchPdb(this.presentation.presentation.code);
			})
			.catch(console.error)
	}

	fetchPdb(code : string){
		const searchUrl = `https://files.rcsb.org/download/${code}.pdb`

		this.$http.get(searchUrl).then(result => {
			this.pdbFile = result.data;
			this.pdbStructure = pv.io.pdb(this.pdbFile);
			this.pdbLoaded = true;

			if (this.viewer){
				this.renderStructure(this.pdbStructure);
			}
		})
		.catch(console.error);
	}

	linkViewer(viewer){
		this.viewer = viewer;
		
		if(this.pdbStructure){
			this.renderStructure(this.pdbStructure);
		}
	}

	renderStructure(structure){
		this.viewerStructure = this.viewer.cartoon('protein', structure, { color : pv.color.ssSuccession() });

		this.activeState = this.presentation.presentation.states[0];

		this.selectedChain = this.activeState.residueSelector[0];

		this.updateSelection(this.activeState.residueSelector);
	}

	activateState(index : number) : void{
		const activeState = this.activeState = this.presentation.presentation.states[index];

		this.selectedChain = activeState.residueSelector[0];

		if(!this.viewer || !this.viewerStructure){return}

		this.viewer.setCamera(activeState.camera.rotation, activeState.camera.center, activeState.camera.zoom, 300);

		this.updateSelection(activeState.residueSelector);

		this.viewer.requestRedraw();
	}

	updateSelection(residueSelector : any){
		if(!this.viewer || !this.viewerStructure){return}

		// Get just the pv selection objects
		const selectors = residueSelector.map(rs => rs.selector);

		const init_select = this.viewerStructure.structure().createEmptyView();

		this.viewer.rm('spheres')

		selectors.forEach(selection_obj => {
			if (!selection_obj.hasOwnProperty('chain') || !selection_obj.hasOwnProperty('rnums')){
				return;
			}

			this.viewer.ballsAndSticks('spheres', this.viewerStructure.select(selection_obj));

			// This was for highlighting stuff, might reincorperate this feature in the future
			//init_select.addResidues(this.viewerStructure.select(selection_obj).chains()[0].residues());
		});

		this.viewer.requestRedraw();
	}

	start(){
		this.started = true;
		this.activateState(0);
	}

	restart(){
		this.index = 0;
		this.activateState(0);
	}

	prev(){
		if (this.index == 0){
			return;
		}

		this.activateState(--this.index);
	}

	next(){
		if (this.index == this.presentation.presentation.states.length - 1){
			return;
		}

		this.activateState(++this.index)
	}

	isFirstState(){
		return this.activeState.id == this.presentation.presentation.states[0].id;
	}

	isLastState(){
		return this.activeState.id == this.presentation.presentation.states.slice(-1)[0].id;
	}
}

PresentationController.$inject = ['$http', '$stateParams'];

export default PresentationController;