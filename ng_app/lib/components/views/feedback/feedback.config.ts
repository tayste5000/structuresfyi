import * as UIRouter from 'angular-ui-router';

function feedbackConfig($stateProvider: UIRouter.IStateProvider) : void {
	
		$stateProvider.state({
			name: 'feedback',
			url: '/feedback',
			component: 'feedbackComponent'
		});
	
}

feedbackConfig.$inject = [
	'$stateProvider'
];

export default feedbackConfig;
