<template>
	<view class="userLoginPageContainer">
		<image aria-hidden="true" src="../../../static/login_page/loginPage.svg" mode="aspectFill"></image>

		<uni-forms class="form" ref="form" :modelValue="loginData" validate-trigger="bind">
			<!-- 账号 -->
			<uni-forms-item name="loginName">
				<input type="text" aria-label="账号输入框" v-model="loginData.loginName" maxlength="20" role="input"
					placeholder="请输入账号" placeholder-class="placeholder" class="form-input">
			</uni-forms-item>
			<!-- 密码 -->
			<uni-forms-item name="loginPassword">
				<input type="password" maxlength="20" v-model="loginData.loginPassword" aria-label="密码输入框"
					role="password" placeholder="请输入密码" placeholder-class="placeholder" class="form-input">
			</uni-forms-item>
		</uni-forms>

		<!-- 提交按钮 -->
		<button @click="_userLoginSubmit" class="submintBtn" aria-label="提交按钮" role="button"
			style="height: 3rem;width: 3rem;border-radius: 50%;" plain="true">
			<image aria-hidden="true" src="../../../static/login_page/loginBtn.svg" mode="aspectFill"
				style="height: 100%;width: 100%;"></image>
		</button>



		<view class="footer-select-containerInfo">
			<text aria-label="按钮" role="button" @click="loginByphone">手机登录</text>
			|<text role="button" @click="registrationHandle">用户注册</text>|
			<text role="button" @click="moreOptions">更多选项</text>
		</view>

		<uni-popup :is-mask-click="false" :animation="true" ref="popup" type="bottom" style="text-align: center;">
			<view style="background-color: #e0e0e0;">
				<view @click="weixinLoginHandle" class="More"
					style="border-bottom:1px solid #eee;height: 2rem; width: 100%; background-color: #fff;line-height:2rem">
					使用微信登录
				</view>
				<view @click="foundPasswordHandle" class="More"
					style="border-bottom:1px solid #eee;height: 2rem; width: 100%; background-color: #fff;line-height:2rem">
					找回密码
				</view>
				<view @click="problemFeedbackHandle" class="More"
					style="border-bottom:1px solid #eee;height: 2rem; width: 100%;background-color: #fff;line-height:2rem">
					问题反馈
				</view>
				<view @click="cancelHandle" class="More"
					style="border:1px solid #eee;height: 2rem; width: 100%;background-color: #fff;line-height:2rem;margin-top: 0.2rem;">
					取消
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				loginData: {
					loginName: '',
					loginPassword: '',
				},
				weixinId: ''
			}
		},
		computed: {

		},
		onLoad() {
			// 获取微信信息
			this._weixingLogin();
		},
		onReady() {
			// 进来就开启规则
			this.$refs.form.setRules(this.userRules);
		},

		methods: {

			async _weixingLogin() {
				console.log('getUserInfo,这是微信端的登录')
				let This = this;
				await uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						This.weixinId = infoRes.encryptedData;
						console.log(infoRes.encryptedData);
						console.log(infoRes)
					}
				});
			},
			// 手机登录
			loginByphone() {
				uni.navigateTo({
					url: "/pages/userInfo/phoneNumberLogin/phoneNumberLogin"
				})
			},
			// 账号注册
			registrationHandle() {
				uni.navigateTo({
					url: '/pages/userInfo/signUpAccount/signUpAccount',
				})
			},
			// 更多选项
			moreOptions() {
				this.$refs.popup.open();
			},
			// 发送数据到后端
			async _sendUserInfo(data) {
				// 通过账号和密码发送
				const userInfo = await this.$http.user_login_username_pwd(data);
				if (userInfo) {
					// 说明登录成功了，这里就可以使用全局的store来存储
					this.updateUserInfo(userInfo);
					uni.showToast({
						title: "用户登录成功",
						icon: "none"
					});
					setTimeout(() => {
						// #ifdef H5
						uni.switchTab({
							url: "/pages/index/index"
						});
						// #endif

						// #ifndef H5
						uni.navigateBack();
						uni.redirectTo({
							url: '/pages/index/index'
						})
						// #endif
					}, 1500)
				}
			},
			// 提交按钮
			async _userLoginSubmit(form) {
				console.log(form)
				this.$refs.form.validate().then(res => {
					// this.$http.user_login_UserName_Password()
					console.log('表单数据信息：', res);
					this._sendUserInfo({
						loginName: res.loginName,
						password: res.loginPassword,
					});
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			...mapMutations(['updateUserInfo']),
			// 微信登录
			weixinLoginHandle() {
				uni.showToast({
					title: '暂不支持',
					icon: 'error'
				})
			},
			// 找回密码
			foundPasswordHandle() {
				uni.showToast({
					title: "请使用电话号码登录，再修改密码",
					icon: 'none'
				})
			},
			// 问题反馈
			problemFeedbackHandle() {
				console.log('问题反馈')
			},
			// 弹出框取消按钮
			cancelHandle() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}

	.userLoginPageContainer {
		display: flex;
		flex-direction: column;
		// justify-content: space-between;
		align-items: center;
		width: 100vw;
		height: 100vh;
		overflow-y: scroll;

		image {
			display: block;
		}

		.form-input {
			background-color: $input-bgcolor;
			height: 3rem;
			width: 80vw;
			border-radius: 1.5rem;
			text-align: center;
		}

		.submintBtn {
			border: 0;
			padding: 0;
			margin: 0;
			background-color: $input-bgcolor;
		}

		.footer-select-containerInfo {
			margin-top: 2rem;
			font-size: 0.75rem;
			font-weight: bold;
			display: flex;
			justify-content: space-around;
			flex-direction: row;

			text {
				margin: 0 1rem;
			}
		}
	}
</style>
