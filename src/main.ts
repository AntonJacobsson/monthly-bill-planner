import {Aurelia} from 'aurelia-framework';
import * as environment from '../aurelia_project/config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import 'bulma/css/bulma.css'
import '../static/style.css';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-dialog'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
