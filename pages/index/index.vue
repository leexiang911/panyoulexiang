<template>
	<view class="content-container">
		<!-- 顶部导航栏 -->
		<NavBar-Top :avatar="avatar"></NavBar-Top>
		<!-- 顶部选项卡 -->
		<TabBar-Top @changeActiveIndex="changeActiveIndex" :lableTypeList="lableList" :activeIndex="activeIndex">
		</TabBar-Top>
		<!-- 文章容器 -->
		<!-- 
		 :articleLableList
		 传入文章分类，可以知道swiper-item数量
		 -->
		<ArticleListContainer :articleLableList="lableList" @changeActiveIndex="changeActiveIndex"
			class="ArticlelistContainer" :activeIndex="activeIndex"></ArticleListContainer>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				// lableList: [],
				activeIndex: 0,
				avatar: '' // 头像地址
			}
		},
		computed: {
			// ...mapState(["LABEL"]), //拿到标签分类列表
			lableList() {
				if (this.USERINFO) { // 标签列表如果用户登录就从用户列表拿，
					this.activeIndex = 0; // 先把激活的页面设置成第一页，避免混乱
					return [...this.$store.state.LABEL.slice(0, 1), ...this.$store.state.LABEL.filter(item => this.USERINFO
						.watchLabelTypeList.includes(item._id))]
				} else {
					return this.$store.state.LABEL
				}
			}
		},
		onLoad() {
			// 获取分类列表
			// console.log(this.LABEL, 666)
			this._initLabelTypeList();
			if (this.USERINFO) {
				this.avatar = this.USERINFO.userInfo.avatar; // 更新头像
			}
		},
		onShow() {
			this._initLabelTypeList();
			if (this.USERINFO) {
				this.avatar = this.USERINFO.userInfo.avatar; // 更新头像
			}
		},
		methods: {
			// 初始化分类列表
			async _initLabelTypeList() {

				if (this.lableList.length) return;
				// 调用云函数返回值
				const res = await this.$http.get_Lable_Type_List();
				this.setLabelList([{
					"name": "全部"
				}, ...res])

			},
			// 触发点击事件
			/* 这里的点击事件是TabBar发送过来的 */
			changeActiveIndex(index) {
				this.activeIndex = index;
			},
			...mapMutations(["setLabelList"])
		},
	}
</script>

<style lang="scss">
	* {
		padding: 0;
		margin: 0;
	}

	page {
		height: 100vh;
		width: 100vw;
		display: flex;
	}

	.content-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;
	}

	.ArticlelistContainer {
		flex: 1;
		box-sizing: border-box;

	}
</style>
