export default {
	// 更新用户信息
	updateUserInfo(state, USERINFO) {
		// 改变用户状态存入vuex，同时也要更新本地数据
		console.log("用户数据刷新成功")
		uni.setStorageSync("PanYouUserInfo", USERINFO);
		state.USERINFO = USERINFO;
	},
	// 修改历史记录存储
	setHistory(state, value) {
		let list = state.HISTORY;
		if ((list.length > 0) && list.findIndex(item => item === value) > -1) return; // 如果已经有了不做处理
		list.unshift(value); // 没有就添加在前面
		uni.setStorageSync("PanYouHistoryList", list);
		state.HISTORY = list;
	},
	// 清空历史搜素记录
	cleanHistory(state) {
		uni.removeStorageSync("PanYouHistoryList");
		state.HISTORY = [];
	},
	// 设置导航栏选项卡
	setLabelList(state, labelList) {
		uni.setStorageSync("PanYouLableList", labelList);
		state.LABEL = labelList;
	}
}
