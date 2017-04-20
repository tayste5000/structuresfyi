import feedbackComponent from './views/feedback/index.ts';
import contributeComponent from './views/contribute/index.ts';
import aboutComponent from './views/about/index.ts';
import presentationComponent from './views/presentation/index.ts';
import pdbSearchComponent from './common/pdbSearch/index.ts';
import presentationBuilderComponent from './views/presentationBuilder/index.ts';
import pvLinkComponent from './common/pvLink/index.ts';
import appComponent from './views/app/index.ts';
import homeComponent from './views/home/index.ts';
import appNavbar from './common/navbar/index.ts';
const dependencies = [
    appComponent,
    homeComponent,
    appNavbar,
    pvLinkComponent,
    presentationBuilderComponent,
    pdbSearchComponent,
    presentationComponent,
    aboutComponent,
    contributeComponent,
    feedbackComponent
];
export default dependencies;