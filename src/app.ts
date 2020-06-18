import {RouterConfiguration, Router} from 'aurelia-router';
import { PLATFORM } from "aurelia-framework";
  
export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    
    config.map([
      { route: [ 'example'],   name: 'example',    moduleId: PLATFORM.moduleName('modules/example/example'), nav: true, title: 'Exempel'},
      { route: ['', 'bill-handler'],   name: 'bill-handler',    moduleId: PLATFORM.moduleName('modules/bill-handler/bill-handler'), nav: true, title: 'Hantera Räkningar' },
      { route: [ 'saving-statistics'],   name: 'saving-statistics',    moduleId: PLATFORM.moduleName('modules/saving-statistics/saving-statistics'), nav: true, title: 'Sparande per månad' },
    ]);
    this.router = router;
  }
}
