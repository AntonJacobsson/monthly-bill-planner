import { Aurelia } from 'aurelia-framework';
import * as environment from '../aurelia_project/config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import '../static/style.scss';
import { TCustomAttribute } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
      config.useCSS('');
    })
    .plugin(PLATFORM.moduleName("aurelia-long-click-event"), { longClickEventName: "long-click", clickDurationMS: 600 })
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      let aliases = ['t', 'i18n'];
      TCustomAttribute.configureAliases(aliases);

      instance.i18next.use(Backend);

      return instance.setup({
        backend: {
          loadPath: './locales/{{lng}}/{{ns}}.json',
        },
        attributes: aliases,
        lng: 'en',
        fallbackLng: 'en',
        debug: false
      });
    });

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
