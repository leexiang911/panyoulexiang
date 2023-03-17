<template>
	<view class="storehouse-content-container">
		<!-- 顶部栏 -->
		<navBartop></navBartop>

		<view class="content" :style="{height:`calc(100vh - ${NavbarHeight}px )`}" style="width: 100vw;">
			<view @click="thumbUpArticles" role="button" class="item">
				<image aria-hidden="true"
					src="https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/thumb_up_fill.svg"
					mode="aspectFill"></image>
				<text>赞过的文章</text>
			</view>
			<view @click="favoriteArticles" role="button" class="item">
				<image aria-hidden="true"
					src="https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/like_fill.svg"
					mode="aspectFill"></image>
				<text>收藏的文章</text>
			</view>
			<view @click="youPublishedArticle" role="button" class="item">
				<image aria-hidden="true"
					src="https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/article.svg" mode="aspectFill">
				</image>
				<text>您发布的文章</text>
			</view>
		</view>
	</view>
</template>

<script>
	import navBartop from "../../components/NavBar-Top/NavBar-Top.vue"
	export default {
		onLoad() {
			// 验证用户登录没有，如果没有登录抓紧去登录
			// #ifdef MP-WEIXIN
			if (!this.USERINFO) {
				uni.redirectTo({
					url: '/pages/userInfo/userLogin/userLogin'
				})
			}
			// #endif

			this.getSystemInfo()
		},
		data() {
			return {
				NavbarHeight: 50,
			}
		},
		components: {
			navBartop,
		},
		methods: {
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.NavbarHeight = menuButtonInfo.top + menuButtonInfo.height;
				// #endif
			},
			// 您已经发布的文章
			youPublishedArticle() {
				uni.navigateTo({
					url: `/pages/article_list/article_list?type=发布`
				})
			},
			// 您收藏的文章
			favoriteArticles() {
				uni.navigateTo({
					url: `/pages/article_list/article_list?type=收藏`
				})
			},
			// 您点赞过的文章
			thumbUpArticles() {
				uni.navigateTo({
					url: "/pages/article_list/article_list?type=点赞"
				})
			},

		},
		created() {}
	}
</script>

<style lang="scss" scoped>
	* {
		padding: 0;
		margin: 0;
	}

	page {
		height: 100vh;
		width: 100vw;
		display: flex;
	}

	.storehouse-content-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;

		.content {
			overflow-y: scroll;
			box-sizing: border-box;
			padding: 1rem;

			.item {
				width: 100%;
				height: 2rem;
				margin-top: 0.2rem;
				border-bottom: 1px solid #eee;
				display: flex;

				image {
					height: 2rem;
					width: 2rem;
				}

				text {
					margin-left: 2rem;
					display: block;
					height: 2rem;
					line-height: 2rem;
				}
			}
		}
	}
</style>
