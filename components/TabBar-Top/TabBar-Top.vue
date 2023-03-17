<template>
	<view class="TabBar-Top-container" aria-label="分类列表">
		<!-- 滚动区域 -->
		<scroll-view :scroll-with-animation="true" scroll-x="true" :scroll-into-view="currentIndex" class="tab-scrollX"
			enable-flex="true" style="display: flex;overflow: hidden;white-space: nowrap;">
			<!-- 图标功能 -->
			<view class="scroll-item-icons"
				style="height: 1.8rem;width: 2.3rem;margin-left: 0.5rem;display: flex;flex-direction: row;">
				<button plain="true" @click="labelManageHandle" aria-label="探索菜单"
					style="padding: 0;margin: 0 0;height: 1.8rem;width: 1.8rem;border: 0;box-sizing: border-box;">
					<image src="../../static/icons/compass.svg" style="width: 60%;height: 60%; margin: 0.3rem;"
						mode="aspectFill"></image>
				</button>
				<view class="verticalLine"
					style="height: 1.4rem;width: 1px;color: #666;background-color: #666;margin-top: 0.3rem;">
				</view>
			</view>

			<!-- 帖子分类菜单 -->
			<view :id="`item${index}`" v-if="lableTypeList" class="scroll-item" @click="changeActiveIndex(index)"
				:class="{active:activeIndex === index}" v-for="(item , index) in lableTypeList"
				style="margin-left: 0.5rem;" :key="index">
				{{item.name}}
			</view>
			<hr>
		</scroll-view>
		<hr>
		<uni-drawer :width="260" ref="drawerLeft" mode="left" :mask-click="true">
			
			<LabelSetting></LabelSetting>
		</uni-drawer>
	</view>
</template>

<script>
	export default {
		name: "TabBar-Top",
		data() {
			return {
				currentIndex: 'item0'
				// list: ["电影", "经典音乐", "书籍", "游戏", "直播", '电子', "科技", "世界", '呵呵']
			};
		},
		watch: {
			activeIndex(index) {
				this.currentIndex = `item${index}`
			}
		},
		props: {
			lableTypeList: Array,
			activeIndex: Number
		},
		onLoad() {},
		mounted() {

		},
		methods: {
			// 触发点击事件，发送出去
			changeActiveIndex(index) {
				this.$emit('changeActiveIndex', index);
			},
			// 检查用户是否登录
			async goLabelAdmin() {
				await this.checkedisLogin();
			},

			labelManageHandle() {
				console.log("标签管理");
				// 打开就是标签管理
				let res= this.goLabelAdmin();
				res.then((res)=>{
					this.$refs.drawerLeft.open();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		padding: 0;
		margin: 0;
	}


	.TabBar-Top-container {
		height: 1.8rem;
		width: 100vw;
		border-bottom: 1px solid #e9e9e9;
		box-sizing: border-box;

		.tab-scrollX {
			line-height: 1.8rem;
			height: 100%;
			width: 100%;
			overflow: hidden;

			.scroll-item {
				background-color: #f5f5f5;
				padding: 0 0.4rem;
				height: 1.4rem;
				margin-top: 0.2rem;
				line-height: 1.4rem;
				font-size: 0.68rem;
				border-radius: 0.7rem;
				box-sizing: border-box;
				border: 1px solid #e0e0e0;

				&.active {
					color: #fff;
					background-color: #616161;
				}
			}
		}
	}
</style>
