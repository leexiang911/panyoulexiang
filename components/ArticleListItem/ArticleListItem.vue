<template>

	<scroll-view scroll-y="true" class="scrollY" @scrolltolower="LoadMoreHandle" v-if="articleList">
		<view class="scorllY-item">
			<ArticleListCard @saveSearchHistory="$emit('saveSearchHistory')" :item="articleList" ></ArticleListCard>
		</view>
		<!-- 用于填充显示不全的问题 -->
		<uni-load-more status="loading" :status="loadData.loading || 'loading'" v-if="isLoadMore && (articleList.length=== 0 || articleList.length>6)" ></uni-load-more>
		<view class=" paddingBottom">
			</view>
	</scroll-view>
</template>

<script>
	export default {
		name: "ArticleListItem",
		data() {
			return {

			};
		},
		props: {
			articleList: Array,
			loadData: {
				type: Object,
				default () {
					return {
						loading: "loading"
					}
				}
			},
			isLoadMore: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			// scroll-view 滚动到底部触发@scrolltolower事件，然后运行此函数  再告诉父组件触发 LoadMoreHandleEvent
			LoadMoreHandle() {
				console.log('ArticleListItem.vue的scroll-view触碰到底部')
				this.$emit("LoadMoreHandleEvent");
			}
		},
	}
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}

	.scrollY {
		// position: fixed;
		width: 100%;
		height: inherit;
		min-height: 100%;
		left: 0;
		bottom: 0;
		transition: all 0.4s;
		box-sizing: content-box;

		.paddingBottom {
			width: 100vw;
			height: 8rem;
		}
	}
</style>
