import * as UIRouter from 'angular-ui-router';

function aboutConfig($stateProvider: UIRouter.IStateProvider) : void {
	
		$stateProvider.state({
			name: 'about',
			url: '/about',
			component: 'aboutComponent'
		});
	
}

aboutConfig.$inject = [
	'$stateProvider'
];

export default aboutConfig;
