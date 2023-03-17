<template>
	<view class="LabelSetting-Container">
		<view class="padding" :style="{height:paddingHeight + 'px'}">
		</view>
		<view class="labelContainer">
			<view class="title">标签管理</view>
			<!-- 我的标签 -->
			<view class="myLabelContainer">
				<view class="header-title">
					<text>我的标签</text>
					<!-- 显示编辑，可以点击编辑和完成切换，这是编辑的icon -->
					<image role="button" @click="changeEditStatus" v-if="!isEditing" aria-label="编辑"
						src="../../static/labelSetting_icon/pencil-square.svg" mode="aspectFill"
						style="width: 0.8rem;height: 0.8rem;"></image>
					<!-- 和编辑互相切换，这是完成的icon -->
					<image @click="changeEditStatus" v-if="isEditing"
						src="../../static/labelSetting_icon/check-square.svg" mode="aspectFill"
						style="width: 0.8rem;height: 0.8rem;"></image>
				</view>

				<view class="labelConten">
					<view class="label-item" v-for="(item,index) in myLabelList" :key="item._id">
						{{item.name}}
						<view @click="removeAlabelFromMyLabelList(item)" v-if="isEditing" role="button" arai-label="关闭"
							style="" class="icon-close">
							<image arai-hidden="true" src="../../static/labelSetting_icon/delete_icon.svg"
								mode="aspectFill" style="width: 90%;height: 90%;"></image>
						</view>
					</view>
				</view>
			</view>

			<!-- 推荐标签 -->
			<view class="recommendedLabels">
				<view class="header-title">
					<text>推荐标签</text>
				</view>


				<view class="labelConten">
					<view @click="addAlabelToMyLabelList(item)" class="label-item"
						v-for="(item ,index) in recommendedLabel" :key="item._id">
						{{item.name}}
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: "LabelSetting",
		data() {
			return {
				paddingHeight: 30,
				isEditing: false,
				tempLabelList: [], // 暂时存储的用户自己的分类
			};
		},
		watch: {
			USERINFO: {
				immediate: true,
				handler(newVal, oldVal) {
					// 把用户追踪的分类复制过去
					try{
						this.tempLabelList = this.USERINFO.watchLabelTypeList;
					}catch(e){
						//TODO handle the exception
						console.log(e,"这里用户没有登录，所以这样")
					}
				}
			}
		},
		created() {
			this.getSystemInfo();
		},
		computed: {
			...mapState(["LABEL"]), //拿到标签分类列表
			myLabelList() {
				return this.LABEL.filter(item => this.tempLabelList.includes(item._id))
			},
			recommendedLabel() {
				return this.LABEL.filter(item => !this.tempLabelList.includes(item._id) && item._id)
			}

		},
		methods: {
			// 获取用户设备信息
			getSystemInfo() {
				// const systemInfo = uni.getSystemInfoSync();
				// systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.paddingHeight = menuButtonInfo.top + menuButtonInfo.height;
				// this.NavbarContentHeight = menuButtonInfo.height;
				// this.NavbarContentWidth = menuButtonInfo.left;
				// #endif
			},
			// 切换是否编辑状态
			changeEditStatus() {
				// 正在编辑状态的点击表示编辑完成了
				if (this.isEditing) {
					this._updateLabelList()
				}
				this.isEditing = !this.isEditing;
			},
			// 添加一个推荐标签到我的标签列表中
			addAlabelToMyLabelList(item) {
				// 前提是要知道是否在编辑状态，如果是在编辑状态就允许，否则就return
				if (!this.isEditing) return; // 不在编辑，return;
				this.tempLabelList.push(item._id);
			},
			// 从我的标签列表中删除一个标签，点击编辑就显示出此按钮（用图片做按钮）
			removeAlabelFromMyLabelList(item) {
				this.tempLabelList = this.tempLabelList.filter(id => id !== item._id)
			},
			// 更新用户标签列表
			async _updateLabelList() {
				// 创建一个暂时数组存储id值
				const tempLabelList = this.myLabelList.map(item => item._id);
				// 向后端发送存储的id
				const res = await this.$http.update_the_users_label({
					"userId": this.USERINFO._id,
					"labelIdList": tempLabelList
				});
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
				this.updateUserInfo({
					...this.USERINFO,
					watchLabelTypeList: tempLabelList
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.LabelSetting-Container {
		.padding {
			background-color: #f5f5f5;
			width: 100%;
		}

		.labelContainer {
			.title {
				text-align: center;
			}

			// 我的标签
			.myLabelContainer {
				min-height: 8rem;
				margin-bottom: 1rem;
				box-sizing: border-box;

				text {
					font-size: 0.8rem;
					color: #686868;
				}

				.header-title {
					display: flex;
					justify-content: space-between;
					padding: 0 1rem;
					margin-bottom: 0.3rem;
					border-bottom: 1px solid #c7c7c7;
				}

				.labelConten {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;

					.label-item {
						padding: 0 0.2rem;
						margin: 0.2rem;
						font-size: 0.85rem;
						height: 1.2rem;
						line-height: 1.2rem;
						background-color: #686868;
						border-radius: 0.6rem;
						color: #f5f5f5;
						box-shadow: 0 0 1px;
						position: relative;

						// 删除的标签
						.icon-close {
							width: 0.9rem;
							height: 0.9rem;
							background-color: #f40;
							border-radius: 50%;
							position: absolute;
							right: -0.5rem;
							top: -0.5rem;
							border: 2px solid #f5f5f5;
							display: flex;
							justify-content: center;
							align-items: center;

						}
					}
				}
			}

			// 推荐标签
			.recommendedLabels {
				min-height: 8rem;
				box-sizing: border-box;

				text {
					font-size: 0.8rem;
					color: #686868;
				}

				.header-title {
					padding: 0 1rem;
					margin-bottom: 0.3rem;
					border-bottom: 1px solid #c7c7c7;
				}

				.labelConten {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;

					.label-item {
						padding: 0 0.2rem;
						margin: 0.2rem;
						font-size: 0.85rem;
						height: 1.2rem;
						line-height: 1.2rem;
						background-color: #686868;
						border-radius: 0.6rem;
						color: #f5f5f5;
					}
				}
			}
		}
	}
</style>
