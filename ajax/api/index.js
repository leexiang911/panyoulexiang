const requireApi = require.context('.', true, /.js$/);
let module = {};
// console.log(requireApi.keys());
requireApi.keys().forEach((key, index) => {
	if (key == './index.js') return;
	// console.log(requireApi(key))
	Object.assign(module, requireApi(key));
});

export default module;
