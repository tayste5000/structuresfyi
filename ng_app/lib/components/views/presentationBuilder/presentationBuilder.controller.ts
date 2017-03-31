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

class PresentationbuilderController implements ng.IComponentController{
	public pdbFile : string;
	public pdbStructure : any;
	public pdbLoaded : boolean;
	public viewer : any;
	public viewerStructure : any;
	public states : Array<ViewerState>;
	public activeState : any;
	public selectedChain : any;
	public selectedView : string;
	public frameNumber : number;
	public started : boolean;
	public index : number;
	public presentation : any;


	constructor(public $state : ng.ui.IStateService,
		public $http : ng.IHttpService,
		public $scope : ng.IScope){
		this.menuItems = [{
			state: 'builderSearch',
			text: 'Load PDB'
		},
		{
			state: 'builderInfo',
			text: 'Information'
		},
		{
			state: 'builderFrames',
			text: 'Edit Frames'
		},
		{
			state: 'builderDisplay',
			text: 'Edit Display'
		},
		{
			state: 'builderPreview',
			text: 'Preview Presentation'
		},
		{
			state: 'builderPublish',
			text: 'Publish Presentation'
		}];

		this.presentation = {};

		this.pdbLoaded = false;
		this.started = false;
		this.frameNumber = 1;
		this.index = 0;
	}

	$onInit(){
		if (this.$state.current != 'builderSearch'){
			this.$state.go('builderSearch');
		}
	}

	loadPdb(pdb_file : string, pdb_code : string) : void{
		// If this is the first time loading set loaded to true and navigate user to the instructions view

		if (!this.pdbLoaded){
			this.pdbLoaded = true;
		}

		// Set pdbFile and structure
		this.pdbFile = pdb_file;

		this.pdbStructure = pv.io.pdb(this.pdbFile);

		this.presentation.presentation = {code: pdb_code};

		if (this.viewer){
			this.renderStructure(this.pdbStructure);
		}

		this.$state.go('builderInfo');
	}

	linkViewer(viewer){
		this.viewer = viewer;
		
		if(this.pdbStructure){
			this.renderStructure(this.pdbStructure);
		}
	}

	renderStructure(structure){
		this.viewer.rm('protein');
		this.viewerStructure = this.viewer.cartoon('protein', structure, { color : pv.color.ssSuccession() });

		// Initialize viewer states
		this.states = this.presentation.presentation.states = [];

		const new_id = this.frameNumber;

		this.states.push({
			camera: {
				zoom: ng.copy(this.viewer.zoom()),
				center: ng.copy(this.viewer.center()),
				rotation: ng.copy(this.viewer.rotation())
			},
			message: '',
			residueSelector: this.getResidueSelector(this.pdbStructure),
			id: new_id
		});

		this.frameNumber++;

		this.activeState = this.states[0];

		this.selectedChain = this.activeState.residueSelector[0];

		this.updateSelection(this.activeState.residueSelector);
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

	getResidueSelector(structure : any){
		return structure.chains().map(chain => (
			{
				selector: {
					chain: chain.name(),
					rnums: []
				},
				residues: chain.residues().map(res => ({name: res.name(), num: res.num()})),
				name: chain.name()
			}));
	}

	displayChainResiduePair(pair : any){
		return `${pair.chain} - ${pair.residue.index + 1} (${pair.residue.name})`
	}

	setViewer(viewer : any) : void{
		this.viewer = viewer;
	}

	activateState(index : number) : void{
		const activeState = this.activeState = this.states[index];

		this.selectedChain = activeState.residueSelector[0];

		if(!this.viewer || !this.viewerStructure){return}

		this.viewer.setCamera(activeState.camera.rotation, activeState.camera.center, activeState.camera.zoom, 300);

		this.updateSelection(activeState.residueSelector);

		this.viewer.requestRedraw();
	}

	updateViewerStructure(viewer_structrue : any) : void{
		this.viewerStructure = viewer_structrue;

		// Initialize viewer states
		this.states = [];

		const new_id = this.frameNumber;

		this.states.push({
			camera: {
				zoom: ng.copy(this.viewer.zoom()),
				center: ng.copy(this.viewer.center()),
				rotation: ng.copy(this.viewer.rotation())
			},
			message: 'Create something awesome',
			residueSelector: this.getResidueSelector(this.pdbStructure),
			id: new_id
		});

		this.frameNumber++;

		this.activeState = this.states[0];

		this.selectedChain = this.activeState.residueSelector[0];

		this.updateSelection(this.activeState.residueSelector);;
	}

	saveState(active_state : any) : void{
		/*
			Save current viewer setting to the active state
		*/

		this.activeState.camera = {
			zoom: ng.copy(this.viewer.zoom()),
			center: ng.copy(this.viewer.center()),
			rotation: ng.copy(this.viewer.rotation())
		}
	}

	addFrame() : void{
		// Add a new frame to the viewer
		const new_id = this.frameNumber;

		const new_length = this.states.push({
			camera: {
				zoom: ng.copy(this.viewer.zoom()),
				center: ng.copy(this.viewer.center()),
				rotation: ng.copy(this.viewer.rotation())
			},
			message: '',
			residueSelector: this.getResidueSelector(this.pdbStructure),
			id: new_id
		});

		this.frameNumber++;

		this.activeState = this.states[new_length - 1];

		this.selectedChain = this.activeState.residueSelector[0];

		this.updateSelection(this.activeState.residueSelector);
	}

	deleteFrame() : void{
		// Delete the active frame
		const id = this.activeState.id;

		const index = lodash.findIndex(this.states, {id: id});

		if (index == -1){
			return;
		}

		this.states.splice(index, 1);

		if (index == 0){
			this.activeState = this.states[0];
		} else {
			this.activeState = this.states[index - 1];
		}
	}

	convertToCode(res_name : string) : string{
	/* A function for converting a 3 letter amino acid code to a 1 letter code */

		const code_map : any {
			'ALA': 'A',
			'CYS': 'C',
			'ASP': 'D',
			'GLU': 'E',
			'PHE': 'F',
			'GLY': 'G',
			'HIS': 'H',
			'ILE': 'I',
			'LYS': 'K',
			'LEU': 'L',
			'MET': 'M',
			'ASN': 'N',
			'PRO': 'P',
			'GLN': 'Q',
			'ARG': 'R',
			'SER': 'S',
			'THR': 'T',
			'VAL': 'V',
			'TYR': 'Y',
			'TRP': 'W'
		};

		const code = code_map[res_name];

		// In case it isn't an actual amino acid, just return the 
		// name with spaces to buffer it in the sequence view
		if (code == null){
			return `-${res_name}-`
		}

		return code;
	}

	isSelected(rnum: number) : boolean{
		/* A function that indicates whether a particular residue has been selected or not */

		// Make sure its not somehow uninitialized
		if (!this.selectedChain || !this.selectedChain.selector || !this.selectedChain.selector.rnums){
			return false;
		}

		return this.selectedChain.selector.rnums.indexOf(rnum) != -1
	}

	handleSelection(rnum : number) : boolean{
		/* A function for handling residue click events, either adds or removes
		a residue from the selection list*/

		// Make sure its not somehow uninitialized
		if (!this.selectedChain || !this.selectedChain.selector || !this.selectedChain.selector.rnums){
			return false;
		}

		// Check if the residue is already in the list
		const index = this.selectedChain.selector.rnums.indexOf(rnum);

		if (index != -1){
			// If so remove it
			this.selectedChain.selector.rnums.splice(index, 1);
		} else {
			// Else add it
			this.selectedChain.selector.rnums.push(rnum);
		}

		this.updateSelection(this.activeState.residueSelector);
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
		if (this.index == this.states.length - 1){
			return;
		}

		this.activateState(++this.index)
	}

	isFirstState(){
		return this.activeState.id == this.states[0].id;
	}

	isLastState(){
		return this.activeState.id == this.states.slice(-1)[0].id;
	}

	publishPresentation(presentation){
		this.$http.post('/api/presentation', presentation)
			.then(response => this.$state.go('presentation', {id: response.data.id}))
			.catch(console.error);
	}
}

PresentationbuilderController.$inject = ['$state', '$http', '$scope'];

export default PresentationbuilderController;