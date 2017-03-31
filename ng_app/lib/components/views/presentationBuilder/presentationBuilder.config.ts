import * as UIRouter from 'angular-ui-router';
import presentationBuilderCtrl from './presentationBuilder.controller.ts';

function presentationBuilderConfig($stateProvider: UIRouter.IStateProvider) : void {
	
		$stateProvider.state({
			name: 'presentationBuilder',
			url: '/presentation_builder',
			abstract: true,
			controller: presentationBuilderCtrl,
			controllerAs: '$ctrl',
			templateUrl: require('./presentationBuilder.component.tpl.html')
		});

		$stateProvider.state({
			name: 'builderInfo',
			url: '/info',
			parent: 'presentationBuilder',
			templateUrl: require('./templates/builderInfo.tpl.html')
		});

		$stateProvider.state({
			name: 'builderFrames',
			url: '/frames',
			parent: 'presentationBuilder',
			templateUrl: require('./templates/builderFrames.tpl.html')
		});

		$stateProvider.state({
			name: 'builderDisplay',
			url: '/display',
			parent: 'presentationBuilder',
			templateUrl: require('./templates/builderDisplay.tpl.html')
		});

		$stateProvider.state({
			name: 'builderPreview',
			url: '/preview',
			parent: 'presentationBuilder',
			templateUrl: require('./templates/builderPreview.tpl.html')
		});

		$stateProvider.state({
			name: 'builderSearch',
			url: '',
			templateUrl: require('./templates/builderSearch.tpl.html'),
			parent: 'presentationBuilder'
		});

		$stateProvider.state({
			name: 'builderPublish',
			url: '/publish',
			templateUrl: require('./templates/builderPublish.tpl.html'),
			parent: 'presentationBuilder'
		});
	
}

presentationBuilderConfig.$inject = [
	'$stateProvider'
];

export default presentationBuilderConfig;
