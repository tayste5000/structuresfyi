import feedbackConfig from './feedback.config.ts';
import feedbackComponent from './feedback.component.ts';
import feedbackRun from './feedback.run.ts';

export default angular.module('structures_site.componants.views.feedback', [])

.config(feedbackConfig)

.component('feedbackComponent', new feedbackComponent())

.run(feedbackRun).name;
