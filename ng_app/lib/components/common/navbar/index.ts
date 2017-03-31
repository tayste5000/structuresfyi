import * as angular from 'angular';

import NavbarComponent from './navbar.component.ts';

export default angular.module('structures_site.components.common.navbar',[])

.component('appNavbar', new NavbarComponent())

.name;