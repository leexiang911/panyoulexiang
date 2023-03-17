export default {
	// 每次获取用户信息比较慢，所以先获取用户存储在本地的信息
	USERINFO: uni.getStorageSync('PanYouUserInfo') || null,
	// 这里是用来存放用户搜素的历史记录
	HISTORY: uni.getStorageSync('PanYouHistoryList') || [],
	// 标签分类的存储，表示我需要看哪些标签，
	LABEL: uni.getStorageSync("PanYouLableList") || [],
}
