<template>
	<view v-if="isShow" class="PopUpLayer" ref="PopUpLayer">
		<!-- 顶部填充物品 -->
		<view class="objectOfPadding" :style="{height:topHeightPadding + 'px'}">
		</view>


		<!-- 这些是没有登录的状态 -->
		<!-- 关闭按钮容器 -->
		<view class="closeBtnContainer">
			<button @click="closeBtnEvent" aria-label="关闭" style="border: 0;padding: 0;" size="mini" plain="true">
				<!-- 关闭按钮的图标 -->
				<view class="close_btn"></view>
			</button>
		</view>

		<!-- 欢迎图片 -->
		<view v-if="!isLogin" style="display: flex;justify-content: center;padding-top: 5vh;box-sizing: border-box;">
			<view class="loginImgcontainer">
				<image aria-hidden="true" src="../../static/user/login欢迎.svg" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 欢迎语言 -->
		<view v-if="!isLogin" class="WelcomewordsContainer">
			<view class="title">
				使用更多的功能
			</view>
			<view class="description">
				立即登录，即可上传文章以及保存文章和发表评论
			</view>
		</view>

		<!-- 登录按钮 -->
		<view v-if="!isLogin" class="loginBtnConatiner">
			<button class="login_btn" @click="loginBtnEvent" aria-label="登录" size="mini" plain="true">登录</button>
		</view>

		<!-- 设置帮助和反馈 -->

		<view class="SettingAndHelpContainer">
			<view class="btncontainer">
				<button  @click="settingHandle" plain="true" :disabled="!isLogin">账号安全</button>
			</view>
			<view class="btncontainer">
				<button plain="true" @click="siginOut" :disabled="!isLogin">退出登录</button>
			</view>
			<view class="btncontainer">
				<button @click="helpHandle" plain="true">反馈和帮助</button>
			</view>
		</view>

		<!--  -->
	</view>
</template>

<script>
	export default {
		name: "PopUpLayer",
		data() {
			return {

			};
		},
		computed: {
			isLogin() {
				return this.USERINFO && true;
			}
		},
		props: {
			isShow: {
				type: Boolean,
				default: false,
			},
			topHeightPadding: Number
		},
		methods: {
			// 关闭按钮
			closeBtnEvent() {
				this.$emit("closePopUpLayerHandle", true);
				uni.showTabBar()
			},
			// 登录按钮
			loginBtnEvent() {
				uni.navigateTo({
					url: '/pages/userInfo/userLogin/userLogin',
					success() {}
				});
				this.$emit("closePopUpLayerHandle", true);
			},
			// 退出按钮
			siginOut(){
				this.$store.commit("updateUserInfo",null);
				uni.redirectTo({
					url:'/pages/index/index'
				});
				this.$emit("closePopUpLayerHandle", true);
			},
			helpHandle(){
				uni.showToast({
					duration:3000,
					title:"请发邮件到51419474@qq.com",
					icon:'none',
				})
			},
			// 账号设置
			settingHandle(){
				this.$emit("closePopUpLayerHandle", true);
				uni.redirectTo({
					url:'/pages/self/self'
				});
			}
		},
		created() {
			console.log(this.isLogin)
		}
	}
</script>

<style lang="scss">
	* {
		margin: 0;
		padding: 0;
	}

	@keyframes run {
		0% {
			height: 0;
		}

		100% {
			height: 100vh;
		}

	}

	.PopUpLayer {
		z-index: 999999999999999;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		animation-delay: 10s;
		animation: run 1s;
		transition: 2s;
		animation-fill-mode: forwards;
		transition-timing-function: ease-in-out;
		overflow-y: scroll;

		// 顶部状态栏的填充物
		.objectOfPadding {
			box-sizing: border-box;
			background-color: #fff;
		}

		// 关闭按钮的容器
		.closeBtnContainer {
			// border: 1px solid #f40;
			box-sizing: border-box;

			// 关闭按钮的内部图标
			.close_btn {
				position: relative;
				width: 2rem;
				height: 2rem;
				margin-left: 1rem;

				&::before,
				&::after {
					position: absolute;
					content: '  ';
					background-color: black;
					left: 1rem;
					height: 2rem;
					width: 1px;
				}

				&::before {
					transform: rotate(45deg);
				}

				&::after {
					transform: rotate(-45deg);
				}

			}
		}

		// 欢迎图片的容器
		.loginImgcontainer {
			width: 50vw;
			height: 50vw;
			box-sizing: border-box;

			image {
				width: 100%;
				height: 100%;
			}
		}

		// 欢迎语言
		.WelcomewordsContainer {
			width: 100%;

			.title {
				text-align: center;
				font-size: 0.8;
				line-height: 0.8rem;
				height: 1.2rem;
				box-sizing: border-box;
			}

			.description {
				text-align: center;
				font-size: 0.75rem;
				height: 2rem;
			}
		}

		// 登录按钮
		.loginBtnConatiner {
			padding-top: 2rem;
			display: flex;
			justify-content: center;
			padding-bottom: 2rem;

			.login_btn {
				padding: 0;
				margin: 0;
				width: 4rem;
				height: 2rem;
				background-color: #6cf;
				color: #fff;
				font-size: 1rem;
				line-height: 2rem;
				border-radius: 1rem;
				border: 0;
			}

			border-bottom: 1px solid #666;
		}

		// 设置帮助和反馈
		.SettingAndHelpContainer {
			padding: 1.5rem 0.8rem;

			.btncontainer {
				button{
					width: 100%;
					height: 2rem;
					border-radius: 1rem;
					background-color: #f5f5f5;
				}
			}

			button {
				margin-bottom: 1rem;
				text-align: left;
				border: 0;
				height: 1.5rem;
				font-size: 0.8rem;
				background-color: transparent;
			}

			border-bottom: 1px solid #666;
		}

	}
</style>
