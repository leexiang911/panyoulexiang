<template>
	<view class="container">
		<view v-if="!articleList.length" class="content-title">
			暂无文章
		</view>

		<ArticleListItem v-if="articleList.length" :articleList="articleList"></ArticleListItem>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleList: []
			}
		},
		methods: {
			// 我点赞的文章
			async getMyThumbUpArticles() {
				const list = await this.$http.get_thumbup_articles({
					"userId":this.USERINFO._id
				});
				this.articleList = list
			},
			// 我收藏的文章
			async getMyFavoriteArticles() {
				const list = await this.$http.get_favorites_article_list({
					"userId":this.USERINFO._id
				});
				this.articleList = list
			},
			// 我发布的文章
			async getMyPublishedArticles() {
				const list = await this.$http.get_author_articles({
					"userId": this.USERINFO._id
				});
				this.articleList = list
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: `您${options.type}的文章`
			});
			switch (options.type) {
				case "发布":
					this.getMyPublishedArticles();
					break;
				case "点赞":
					this.getMyThumbUpArticles();
					break;
				case "收藏":
					this.getMyFavoriteArticles();
				default:
					break;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: #f8f8f8;
		overflow-y: scroll;

		.content-title {
			text-align: center;
			color: #888;
		}
	}
</style>
