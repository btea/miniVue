import { queryElement } from '../util/queryElement';
import Observer, { set, del } from '../observer';
import { Watcher } from '../observer/watch';

export function mixininit(Vue) {
	Vue.prototype._init = function (obj) {
		let data = obj.data;
		let el = queryElement(obj.el);
		this.data = data;
		this.el = this.$root = el;
		new Observer(data);
		this.listenElement(this.el);
	};
	Vue.prototype.$watch = function (expOrFn, cb, options) {
		const vm = this.data;
		options = options || {};
		// debugger
		const watcher = new Watcher(vm, expOrFn, cb, options);
		if (options.immediate) {
			cb.call(vm, watcher.value);
		}
		return function unwatchFn() {
			watcher.teardown();
		};
	};
	Vue.prototype.$set = function (target, key, val) {
		set.call(this, target, key, val);
	};
	Vue.prototype.$delete = function (target, key, val) {
		del.call(this, target, key);
	};
}
