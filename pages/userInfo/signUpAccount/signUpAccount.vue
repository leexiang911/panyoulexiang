<template>
	<view class="singUpContainer">
		<view class="title">
			创建账号
		</view>
		<view class="avatarContainer" style="border-radius: 50%;">
			<image style="z-index: 0;border-radius: 50%;" aria-hidden="true" :src="currentAvatarUrl" mode="aspectFit">
			</image>
			<view role="button" class="iconContainer" @click="changeAvatarHandle">
				<image aria-label="选择头像" src="../../../static/icons/camera-fill.svg" mode="aspectFit"></image>
			</view>
			<!-- 弹出层 -->
			<uni-popup :is-mask-click="false" ref="popup" type="center" :animation="true">
				<Avatars @deselectAvatar="deselectAvatar" @selectThepicture="changeAvatar"
					@saveAvatarPictureHandle="saveAvatarPictureHandle" :avatarList="avatarList">
				</Avatars>
			</uni-popup>
		</view>

		<!-- 表单 -->
		<uni-forms @validate="updateValidateHandle" class="form" ref="form" :modelValue="formData"
			validate-trigger="bind">
			<uni-forms-item class="form-item" labelAlign="center" name="nickname">
				<!-- v-model.trim -->
				<input @input="enterCorrection" aria-label="输入框 请输入昵称" type="text" maxlength="16"
					style="width: 60vw;text-align: center;margin: 0 3rem;height: 2rem; background-color: #eee; color: #000; font-size: 1rem;box-sizing: border-box;border-radius: 0.3rem;box-shadow: 0 0px 3px rgba(0, 0, 0,0.75)"
					class="form-input" v-model.trim="formData.nickname" placeholder="请输入昵称">
			</uni-forms-item>
			<uni-forms-item class="form-item" labelAlign="center" name="emailAddress">
				<input @input="enterCorrection" aria-label="输入框 请输入邮箱" type="email" maxlength="30"
					style="width: 60vw;text-align: center;margin: 0 3rem;height: 2rem; background-color: #eee; color: #000; font-size: 1rem;box-sizing: border-box;border-radius: 0.3rem;box-shadow: 0 0px 3px rgba(0, 0, 0,0.75)"
					class="form-input" v-model.trim="formData.emailAddress" placeholder="请输入邮箱">
			</uni-forms-item>
			<uni-forms-item class="form-item" labelAlign="center" name="registrationPassword">
				<input @input="enterCorrection" aria-label="输入框 请输入密码" type="password" maxlength="30"
					style="width: 60vw;text-align: center;margin: 0 3rem;height: 2rem; background-color: #eee; color: #000; font-size: 1rem;box-sizing: border-box;border-radius: 0.3rem;box-shadow: 0 0px 3px rgba(0, 0, 0,0.75)"
					class="form-input" v-model.trim="formData.registrationPassword" placeholder="请输入密码">
			</uni-forms-item>
			<uni-forms-item class="form-item" labelAlign="center" name="confirmPassword">
				<input @input="enterCorrection" aria-label="输入框 请确认密码" type="password" maxlength="30"
					style="width: 60vw;text-align: center;margin: 0 3rem;height: 2rem; background-color: #eee; color: #000; font-size: 1rem;box-sizing: border-box;border-radius: 0.3rem;box-shadow: 0 0px 3px rgba(0, 0, 0,0.75)"
					class="form-input" v-model.trim="formData.confirmPassword" placeholder="请确认密码">
			</uni-forms-item>
		</uni-forms>

		<button plain="true" :disabled="!btnDisable" @click="_submitHandle"
			:style="{backgroundColor:(btnDisable?'#0099FF':'#80D8FF'),color:(btnDisable?'#FFFFFF':'#ebedee')}"
			style="margin: 0 3rem ;height: 2rem; line-height: 2rem;font-size: 1rem;width: 60vw;border: 0;">注册并登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarList: [],
				currentAvatarUrl: "", // 当前头像，
				defaultAvatarUrl: "", // 默认头像
				formData: {
					nickname: '', // 昵称
					emailAddress: '', // 邮箱地址
					registrationPassword: '', // 注册密码
					confirmPassword: '', // 确认密码
				},
				btnDisable: false // 按钮是否禁用
			}
		},
		onReady() {
			this.$refs.form.setRules(this.userRules);
		},
		onLoad() {
			//加载就获取用户头像
			this._getAvatars()
		},
		methods: {
			// 获取头像列表
			async _getAvatars() {
				this.avatarList = await this.$http.get_list_of_avatars();
				this.currentAvatarUrl = this.defaultAvatarUrl = this.avatarList[0].url;
			},
			// 更换头像 打开弹出层
			changeAvatarHandle() {
				this.$refs.popup.open();
			},
			//avatas  $emit=> 头像组件选中的图片，传递url给我们，我们给他设置位当前图片
			changeAvatar(url) {
				this.currentAvatarUrl = url;
			},
			// avatars $emit => 头像组件取消保存
			deselectAvatar() {
				// 取消保存就关闭弹窗
				this.$refs.popup.close();
				//  回到默认头像
				this.currentAvatarUrl = this.defaultAvatarUrl;
			},
			// avatars $emit => 用户保存头像			
			saveAvatarPictureHandle(e) {
				this.currentAvatarUrl = e;
				this.$refs.popup.close();
				console.log(this.currentAvatarUrl)

			},
			// 去掉用户输入的空格，因为本trim 不管用了
			tirmValue() {
				// 昵称
				let nicknameValue = this.formData.nickname.trim(); // trim()好像没有用了
				nicknameValue = nicknameValue.replace(/[, ]/g, '');
				this.formData.nickname = nicknameValue;
				// 邮件
				let emailAddressValue = this.formData.emailAddress.trim();
				emailAddressValue = emailAddressValue.replace(/[, ]/g, '');
				this.formData.emailAddress = emailAddressValue;
				// 注册密码
				let registrationPasswordValue = this.formData.registrationPassword.trim();
				registrationPasswordValue = registrationPasswordValue.replace(/[, ]/g, '');
				this.formData.registrationPassword = registrationPasswordValue;
				// 确认密码			
				let confirmPasswordValue = this.formData.confirmPassword.trim();
				confirmPasswordValue = confirmPasswordValue.replace(/[, ]/g, '');
				this.formData.confirmPassword = confirmPasswordValue;
			},
			// 输入矫正函数
			enterCorrection() {
				// 运行去空格
				this.tirmValue();
			},
			async accountRegistration(data) {
				const res = await this.$http.add_a_new_user(data)
				this.updateUserInfo(res); // 更新用户数据
				uni.showToast({
					title: "注册成功",
					icon: "none"
				});

			},
			// 表单实时验证，如果好了就打开按钮，
			updateValidateHandle(err) {
				if (this.formData.nickname && this.formData.emailAddress && this.formData.registrationPassword && this
					.formData.confirmPassword) {
					if (!err) {
						// 表单没有错误了
						this.btnDisable = true; // 解开按钮

					} else {
						// 表单还有错
						this.btnDisable = false; // 锁定按钮
					}
				}

			},
			async _submitHandle() {
				console.log('提交')
				await this.$refs.form.validate().then(res => {
					// console.log('表单验证通过', res)
					console.log(res)
					const {
						confirmPassword,
						nickname,
						emailAddress
					} = this.formData
					this.accountRegistration({
						loginName: emailAddress,
						password: confirmPassword,
						userInfo: {
							avatar: this.currentAvatarUrl,
							name: nickname
						}
					})
					setTimeout(() => {
							uni.navigateTo({
								url: '/pages/index/index'
							})
						},1000)

				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: "请稍后重试",
						icon: "none"
					})
				})
			}

		},
	}
</script>

<style lang="scss" scoped>
	.singUpContainer {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		// padding: 1rem;
		.title {
			font-size: 1rem;
			font-weight: bold;
			text-align: center;
		}

		.avatarContainer {
			width: 6rem;
			height: 6rem;
			position: relative;
			border: 2px solid #eee;
			margin: 2rem;
			border-radius: 50%;
			box-shadow: 0 0px 3px rgba(0, 0, 0, 0.75);

			image {
				width: 100%;
				height: 100%;
			}

			.iconContainer {
				position: absolute;
				right: 0;
				background-color: #eceff1;
				width: 1.5rem;
				height: 1.5rem;
				border-radius: 50%;
				bottom: 0.25rem;
				border: 1px solid #fff;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				box-shadow: 0 0px 3px rgba(0, 0, 0, 0.75);

				image {
					width: 80%;
					height: 80%;
				}
			}
		}

		.form {
			width: 100%;
			display: flex;
			text-align: center;
			justify-content: space-around;
			align-items: center;
		}
	}
</style>
