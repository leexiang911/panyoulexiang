<template>
	<view class="authorArticleContainer">

		<ArticleListItem :articleList="articleList"></ArticleListItem>
		<view style="text-align: center;" class="no-data" v-if="!articleList.length">
			他还没有发布文章
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				author: null,
				articleList: []
			}
		},
		methods: {
			async getAuthorAllArticle() {
				const list = await this.$http.get_author_articles({
					"userId": this.author._id
				});
				this.articleList = list

			}
		},
		onLoad(...options) {
			this.author = JSON.parse(options[0].author)

			uni.setNavigationBarTitle({
				title: `${this.author.userInfo.name} 的文章`
			});
			this.author && this.getAuthorAllArticle();
		}
	}
</script>

<style lang="scss" scoped>
	.authorArticleContainer {
		width: 100vw;
		height: 100vh;
		overflow-y: scroll;
	}
</style>
