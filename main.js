import App from './App';
import module from 'ajax/api/index.js'; //导入封装的公共请求

import useRulesMixin from './common/rulesMixin.js'; //引入验证规则
import commonMixin from './common/commonMixin.js';// mixin 导入
import store from './store/index.js'; //导入vuex 的store




// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store, //挂载store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

Vue.prototype.$http = module; // 挂载封装的公共请求
Vue.use(useRulesMixin); // 使用验证规则
Vue.use(commonMixin); // 使用全局的mixin文件

