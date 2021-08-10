import Vue from './core/instance/index';
import { initGlobalAPI } from './core/global-api/index';
import { FunctionalRenderContext } from 'core/vdom/create-functional-component';
initGlobalAPI(Vue);

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
	value: FunctionalRenderContext,
});

Vue.version = '__VERSION__';

export default Vue;
