import {RouterConfiguration, Router} from 'aurelia-router';
import { PLATFORM } from "aurelia-framework";
  
export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    
    config.map([
      { route: [ 'example'],   name: 'example',    moduleId: PLATFORM.moduleName('example'), nav: true, title: 'Exempel'},
      { route: ['', 'bill-handler'],   name: 'bill-handler',    moduleId: PLATFORM.moduleName('bill-handler'), nav: true, title: 'Hantera Räkningar' },
      { route: [ 'saving-statistics'],   name: 'saving-statistics',    moduleId: PLATFORM.moduleName('saving-statistics'), nav: true, title: 'Sparande per månad' },
    ]);
    this.router = router;
  }
}
