import * as UIRouter from 'angular-ui-router';

function contributeConfig($stateProvider: UIRouter.IStateProvider) : void {
	
		$stateProvider.state({
			name: 'contribute',
			url: '/contribute',
			component: 'contributeComponent'
		});
	
}

contributeConfig.$inject = [
	'$stateProvider'
];

export default contributeConfig;
