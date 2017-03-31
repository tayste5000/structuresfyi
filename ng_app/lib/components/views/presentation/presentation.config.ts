import * as UIRouter from 'angular-ui-router';

function presentationConfig($stateProvider: UIRouter.IStateProvider) : void {
	
		$stateProvider.state({
			name: 'presentation',
			url: '/presentation/:id',
			component: 'presentationComponent'
		});
	
}

presentationConfig.$inject = [
	'$stateProvider'
];

export default presentationConfig;
