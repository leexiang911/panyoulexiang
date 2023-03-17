import Vue from 'vue'; // 导入vue
import VueX from 'vuex'; // 导入vuex
import state from './state.js'; // 导入状态机
import mutations from './mutations.js';
import actions from './actions.js'
Vue.use(VueX); // 使用


// 导出实例对象，在main.js中挂载
export default new VueX.Store({
	state,
	mutations,
	actions,
});
