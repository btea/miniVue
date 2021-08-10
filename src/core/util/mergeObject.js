export function mergeObject(target, obj) {
	let keys = Object.keys(obj);
	keys.forEach(key => {
		if (!target.hasOwnProperty(key)) {
			target[key] = obj[key];
		}
	});
}
