<template>
	<view class="saerchContainer">
		<!-- 没用的填充物 -->
		<view class="padding" style="width: 100%;background-color: #fff;" :style="{height:contentHeight + 'px'}"></view>

		<!-- 搜索框容器 -->
		<view class="inputContainer">
			<button @click="backHandle" aria-label="返回按钮"
				style="position: absolute;left: 0.5rem; width: 2rem; padding: 0;margin: 0;height: 2rem;display: flex;justify-content: center;align-items: center;border-radius: 50%;overflow: hidden;border: 0;"
				:plain="true" size="mini">
				<image src="../../static/searchPages/arrow-left-circle.svg"
					style="width: 1.5rem; height: 1.5rem; color: #f40;" mode="aspectFill"></image>
			</button>

			<input @input="searchInput" v-model.trim="searchValue" @confirm="_changeInput" confirm-type="search"
				class="inputSearch" type="text" :focus="true" style="background-color: #f5f5f5;" placeholder="请输入内容搜索">
		</view>
		<!-- 搜索历史的容器 -->
		<view v-if="isSearch && HISTORY.length"  class="historyContainer">
			<view class="history-header">
				<text class="history-text">最近的搜索内容</text>
				<image class="history-clear" src="../../static/searchPages/delete.svg" aria-label="清楚历史记录"
					@click="clearHistory" mode="aspectFill"></image>
			</view>
			<!-- 搜索内历史 -->
			<view  class="search-history-content">
				<view @click="openHistory(item)" class="history-item" v-for="(item,index) in HISTORY">
					{{item}}
				</view>
			</view>
		</view>

		<view v-if="searchReturnValuesList.length && !isSearch" class="searchValueContainer"
			:style="{height:`calc(100% - ${contentHeight}px - 2rem)`}">
			<ArticleListItem @saveSearchHistory="saveSearchHistory" :isLoadMore="false"
				:articleList="searchReturnValuesList"></ArticleListItem>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				contentHeight: 30, // 顶部的填充物，为了适配屏幕的状态栏的
				searchValue: "", //搜索值
				searchReturnValuesList: [], // 搜索返回来的值
				isSearch: true, // 是否在搜素
			}
		},
		methods: {
			// 获取设备信息
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				// systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.contentHeight = menuButtonInfo.top + menuButtonInfo.height;

				// #endif
			},
			// 返回上一页的返回按钮
			backHandle() {
				// #ifdef H5
				uni.switchTab({
					url: "/pages/index/index"
				})
				// #endif
				// #ifndef H5
				uni.navigateBack();
				// #endif
			},
			// 搜索框的完成按钮的事件，比如你按下了回车
			async _changeInput(e) {
				this.searchInput()
				// 这里的e暂时没用，可以处理input绑定的值，如果是空值我们就不给搜索
				if (this.searchValue === "") {
					console.log("空值不给搜索")
					return;
				}
				this.isSearch = false; //
				let res = await this.$http.get_search_values({
					"searchVal": this.searchValue
				});
				this.searchReturnValuesList = res.searchValueList;
				console.log(res.searchValueList, Array.isArray(res.searchValueList))

			},
			// 清空历史记录
			clearHistory() {
				this.cleanHistory()
			},
			// 输入框输入事件，因为trim函数失效了，所以处理一下，这里的目的是去掉空格，去掉空字符
			searchInput(e) {
				this.isSearch = true;
				// 优化后的值
				let optimizeValue = this.searchValue.trim();
				optimizeValue = optimizeValue.replace(/[, ]/g, '');
				this.searchValue = optimizeValue;
			},
			// 这是listCard $emit=> listItem $emit => search 传递过来的事件，方便存储数据
			saveSearchHistory() {
				console.log(666);
				console.log(this.searchValue)
				this.setHistory(this.searchValue)
			},
			// 点击历史列表中的标签，进行搜素
			openHistory(item){
				this.searchValue = item;// 文字给了输入的值，绑定到搜索框
				this._changeInput()// 请求数据
				console.log(item)
			},
			// 写入数据，和清空历史数据
			...mapMutations(["setHistory","cleanHistory"])

		},
		onLoad() {
			this.getSystemInfo(); // 获取状态栏高度
		},
		computed:{
			...mapState(["HISTORY"])
		}
	}
</script>

<style lang="scss" scoped>
	.saerchContainer {
		width: 100vw;
		height: 100vh;

		// 列表展示框
		.searchValueContainer {
			width: 100%;
			// 百分之八的高度减去顶部栏，减去输入框的高度
			overflow-y: scroll;
		}
	}

	.inputContainer {
		display: flex;
		justify-content: center;
		position: relative;

		.inputSearch {
			width: 65vw;
			height: 2rem;
			border-radius: 1rem;
			padding: 0 1rem;
			font-size: 1rem;
		}
	}

	.historyContainer {
		width: 75vw;
		height: 15rem;
		background-color: #fff;
		margin: 1rem auto;
		box-sizing: border-box;
		border-top: 0;
		overflow: hidden;

		.history-header {
			font-size: 0.8rem;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-bottom: 0.25rem;

			.history-text {
				height: 1rem;
				color: #9d9d9d;
			}

			.history-clear {
				height: 1rem;
				width: 1rem;
			}
		}

		.search-history-content {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			overflow: hidden;
			max-height: 17rem;

			.history-item {
				font-size: 0.75rem;
				box-sizing: border-box;
				border-radius: 0.5rem;
				line-height: 0.75rem;
				vertical-align: middle;
				margin: 0.2rem;
				background-color: #9d9d9d;
				color: #f5f5f5;
				padding: 0 0.2rem;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}


	}
</style>
