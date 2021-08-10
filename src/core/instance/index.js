import { mergeObject } from '../util/mergeObject';
import { Watcher } from '../observer/watch';
import { mixininit } from './init';

const methods = {
	listenElement(el) {
		let child = el.childNodes;
		if (!child.length) {
			return;
		}
		for (let i = 0; i < child.length; i++) {
			if (child[i].nodeType === 1) {
				let ele = child[i];
				let v = ele.innerText;
				this.watchData(v, ele);
			}
		}
	},
	watchData(text, el) {
		let reg = /\{\{(.{1,})\}\}/g;
		let realText = text.replace(reg, (match, key) => {
			return this.realValue(this.data, key);
		});
		el.innerText = realText;
		let v = RegExp.$1;
		new Watcher(this.data, v, function (val, oldVal) {
			realText = el.innerText;
			el.innerText = realText.replace(oldVal, val);
		});
	},
	realValue(obj, key) {
		key = key.split('.');
		let v;
		for (let i = 0; i < key.length; i++) {
			if (!v) {
				v = obj[key[i]];
			} else {
				v = v[key[i]];
			}
		}
		return v;
	},
};

function Vue(options) {
	this._init(options);
}
mergeObject(Vue.prototype, methods);
mixininit(Vue);
export default Vue;
