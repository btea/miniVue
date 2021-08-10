import { def } from './def';
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(Array.prototype);
['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
	// 缓存原始方法
	const origin = arrayProto[method];
	def(arrayMethods, method, function mutator(...args) {
		const result = origin.apply(this, args);
		const ob = this.__ob__;
		console.log('数组改变了');
		// 获取新增元素
		let inserted;
		switch (method) {
			case 'push':
			case 'unshift':
				inserted = args;
				break;
			case 'splice':
				inserted = args.slice(2);
				break;
		}

		if (inserted) {
			ob.observeArray(inserted);
		}
		// 手动监听，手动触发更新
		ob.dep.notify();
		return result;
	});
});
