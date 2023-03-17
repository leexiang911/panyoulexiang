<template>
	<view class="ArticleListContainer">
		<swiper :current="activeIndex" @change="swiperChangeEvent" duration="450" style="height: 100%;">
			<swiper-item v-for="(item,index) in articleLableList" :key="item._id">
				<view class="swiper-item">
					<ArticleListItem @LoadMoreHandleEvent="LoadMoreHandleEvent" :isLoadMore="true" :loadData="loadData[index]" :articleList="articleData[index]"
						style="height: 100%"></ArticleListItem>

				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: "ArticleListContainer",
		data() {
			return {
				articleData: {}, //创建一个缓存数组
				loadData: {},
				pageSize: 6, // 页容量，一页多少条
			}
		},
		props: {
			articleLableList: Array,
			activeIndex: Number,
		},
		methods: {
			// 滑块改变
			swiperChangeEvent(e) {
				// 获得当前滑动到的索引值
				const index = e.detail.current;

				// 发送滑动到的索引出去，由于是需要和导航栏TabBar-top发生联动，所以就把名字弄成一样
				this.$emit("changeActiveIndex", index);
				console.log('当前是' + index)
				if (!this.articleData[index] || !this.articleData[index].length) {
					this._GET_articleList(index);
				}

			},

			// 远程获取文章列表
			async _GET_articleList(currentIndex) {
				let name = "全部";
				if (this.articleLableList[currentIndex].name) {
					name = this.articleLableList[currentIndex].name;
				}

				if (!this.loadData[currentIndex]) {
					this.loadData[currentIndex] = {
						page: 1,
						loading: "loading",
						total: 0
					}
				}

				const {
					articleList,
					total
				} = await this.$http.get_list_of_articles({
					articleType: name,
					page: this.loadData[currentIndex].page,
					pageSize: this.pageSize
				});

				let oldList = this.articleData[currentIndex] || []; // 追加每一次的请求数据
				oldList.push(...articleList);
				this.$set(this.articleData, currentIndex, oldList); //触发视图更新
				this.loadData[currentIndex].total = total;
				if(total === 0)this.loadData[currentIndex].loading = "noMore"
			},
			// 由于是obser对象

			// 子组件传递过来的事件 （this.$emit()）scroll-view 触碰到底部了，告诉我们需要加载跟多内容了
			/* 加载更多内容事件 */
			LoadMoreHandleEvent() {
				if (this.loadData[this.activeIndex].total === this.articleData[this.activeIndex].length) {
					this.loadData[this.activeIndex] = {
						...this.loadData[this.activeIndex],
						...{
							loading: "noMore"
						}
					}
					this.$forceUpdate(); //强制进行页面的更新
					return;
				}
				this.loadData[this.activeIndex].page++;				
				this._GET_articleList(this.activeIndex);
			}

		},
		created() {
			console.log(this.articleLableList.length)
			this.articleLableList.length && this._GET_articleList(this.activeIndex);
		},
		watch: {
			// 监听分类列表，方便发送请求需要的文章列表
			articleLableList(new_value, old_value) {
				if (JSON.stringify(new_value) === JSON.stringify(old_value)) return; // 如果值没改变就不用运行了，说明还是同一个分类
				this.articleData = {};
				this.loadData = {}
				this._GET_articleList(this.activeIndex);
			}
		}
	}
</script>

<style lang="scss">
	* {
		padding: 0;
		margin: 0;
	}

	.ArticleListContainer {
		// background-color: #666;
		height: 100vh;
		box-sizing: border-box;
		position: relative;

		.swiper-item {
			height: 100%;
			width: 100%;
		}
	}
</style>
