<template>
	<view class="NavBar-Top_container" :style="{height:NavbarHeight + 'px'}">


		<view class="NavBar-Top-content"
			:style="{height:NavbarContentHeight + 'px',lineHeight:NavbarContentHeight + 'px'}">

			<view class="Navbar-content" :style="{width:NavbarContentWidth + 'px'}">

				<!-- 签到 -->
				<view class="NavBar-Top-item">
					<button size="mini" aria-label="签到" class="label_btn" :plain="true" @click="_signHandle">
						<image aria-hidden="true" src="../../static/nav_bar_top/calendar-check.svg" mode="aspectFill">
						</image>
					</button>
				</view>
				<!-- 搜索 -->
				<view class="NavBar-Top-item">
					<button size="mini" aria-label="搜索" class="label_btn" :plain="true" @click="searchHandle">
						<image aria-hidden="true" src="../../static/nav_bar_top/search.svg" mode="aspectFill">
						</image>
					</button>
				</view>
				<!-- 通知 -->
				<view class="NavBar-Top-item">
					<text aria-hidden="true" v-show="noticeNumber" class="noticeMessageNumber">
						{{noticeNumber}}
					</text>
					<button size="mini" :aria-label="!noticeNumber? '通知': `通知 ${noticeNumber}项内容未读`" class="label_btn"
						:plain="true" @click="noticeHandle">
						<image aria-hidden="true" src="../../static/nav_bar_top/bell.svg" mode="aspectFill">
						</image>
					</button>
				</view>
				<!-- 用户 -->
				<view class="NavBar-Top-item">
					<button size="mini" aria-label="您的账号" class="label_btn" :plain="true" @click="userClickHandle">
						<image v-if="avatar" aria-hidden="true" :src="avatar" mode="aspectFill">
						</image>
						<image v-if="!avatar" aria-hidden="true" :src="isAvatar" mode="aspectFill">
						</image>
					</button>
				</view>
			</view>
		</view>

		<!-- 用户设置 -->
		<PopUpLayer v-if="isShow" @closePopUpLayerHandle="closePopUpLayerHandle" :isShow="isShow"
			:topHeightPadding="NavbarHeight"></PopUpLayer>
	</view>
</template>

<script>
	export default {
		name: "NavBar-Top",
		data() {
			return {
				NavbarHeight: 20, //默认是20
				NavbarContentHeight: 20, //默认是20
				NavbarContentWidth: 360,
				message: 6,
				noticeNumber: 0, // 多少项未查看的内容
				isShow: false,
				isAvatar: '../../static/nav_bar_top/person-circle.svg'
			};
		},
		props: {
			avatar: String
		},
		created() {
			this.getSystemInfo(); // 获取设备信息，比如状态栏和 胶囊
			if (this.USERINFO) {
				this.isAvatar = this.USERINFO.userInfo.avatar;
			}
			
		},
		methods: {
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.NavbarHeight = menuButtonInfo.top + menuButtonInfo.height;
				this.NavbarContentHeight = menuButtonInfo.height;
				this.NavbarContentWidth = menuButtonInfo.left;
				// #endif
			},
			// 签到按钮点击事件
			async _signHandle() {
				// 先检查用户是否登录
				await this.checkedisLogin();
				// 现在时间
				const date = new Date(); //年月日

				let fullDate = date.getFullYear().toString() + "_" + (date.getMonth() + 1).toString() + "_" + date
					.getDate()
				// 如果是空说明是第一次签到
				if (this.USERINFO.LastCheckinTime === "") {
					console.log('签到，如果没有显示出来是用户属性里面没有添加');
					return
				} else {
					// 上次服务器存储的签到时间
					const lastTime = this.USERINFO.LastCheckinTime

					const lastDateArr = lastTime.split("_"); // 获取到上次时间的数组
					const newDateArr = fullDate.split("_"); // 获取到现在时间的数组，方便计算

					// 循环数组做对比，如果现在任何时间大于过去时间就是表示你现在可以签到
					for (let i = 0; i < lastDateArr.length; i++) {
						if (newDateArr[i] - lastDateArr[i]) {
							await this.$http.add_checkin_time({
								"userId": this.USERINFO._id,
								"newTime": fullDate,
							})
							uni.showToast({
								title: "签到成功",
								icon: 'success'
							})
							// 重新更新数据
							console.log(this.updateUserInfo)
							this.updateUserInfo({
								...this.USERINFO,
								"LastCheckinTime": fullDate
							});
							return;
						}
					}
					uni.showToast({
						title: "您已签到，祝您度过愉快的一天",
						icon: "none"
					})
					return;
				}
			},
			// 搜索按钮点击事件
			searchHandle() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			// 通知按钮点击事件
			noticeHandle() {
				uni.showToast({
					title: "暂时没有通知",
					icon: 'none'
				})
			},
			// 用户按钮点击事件
			userClickHandle() {
				// 弹出层
				this.isShow = true;
				console.log(this.NavbarContentHeight, `胶囊底部的位置${this.NavbarHeight}px`);
				uni.hideTabBar();
				// uni.navigateTo({
				// 	url: "/pages/userInfo/userSetting/userSetting",
				// 	animationDuration: 0
				// })
				// if (this.USERINFO.userInfo.avatar) {
				// 	this.avatarUrl = this.USERINFO.userInfo.avatar
				// }

				if (this.USERINFO) {
					if (this.USERINFO.userInfo) {
						this.avatarUrl = this.USERINFO.userInfo.avatar
					}
				}

			},

			// 关闭弹出层的事件
			closePopUpLayerHandle(e) {
				this.isShow = !e;
			},
			// 判断用户状态，有没有登录			
		},
		onLoad() {

		},

	}
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}

	page {
		position: relative;
		width: 100vw;
		height: 100vh;
	}

	.NavBar-Top_container {
		background-color: #f8f8f8;
		width: 100%;
		position: relative;
		box-sizing: border-box;

		.NavBar-Top-content {
			position: absolute;
			left: 0;
			bottom: 0;

			.Navbar-content {
				@include flex(space-around);
			}

			.NavBar-Top-item {
				height: 100%;
				color: $light-color;
				width: max-content;

				&:nth-of-type(3) {
					position: relative;

					.noticeMessageNumber {
						position: absolute;
						left: 0.5rem;
						top: 0;
						background-color: red;
						width: 0.7rem;
						height: 0.7rem;
						font-size: 0.6rem;
						line-height: 0.7rem;
						text-align: center;
						border-radius: 50%;
						border: 1px solid #f8f8f8;
						color: #f8f8f8;
					}
				}

				.label_btn {
					border: 0;
					border-radius: 50%;
				}

				image {
					// display: inline-block;
					width: 1rem;
					height: 1rem;
				}
			}
		}
	}
</style>
