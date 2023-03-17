<template>
	<view class="FromsContainer">
		<text class="title">请输入电话号码</text>

		<!-- 手机号码的forms -->
		<uni-forms class="PhoneNumberForm" ref="PhoneNumberForm" @validate="updateData" validate-trigger="bind"
			:modelValue="PhoneNumberData">
			<uni-forms-item name="phoneNumber">
				<input :disabled="phoneNumberIsDisabled" :style="{color:(phoneNumberIsDisabled?'#888':'#000')}"
					style="height: 3rem; caret-color: #f40;font-size: 1.5rem;line-height: 1.5rem;box-sizing: border-box;border-bottom: 1px solid #e0e0e0;"
					class="inputPhoneNumber" maxlength="13" v-model="PhoneNumberData.phoneNumber" type="number">
			</uni-forms-item>
		</uni-forms>

		<!-- 验证码的forms -->
		<uni-forms class="PhoneCodeForm" ref="PhoneCodeForm" :modelValue="PhoneCodeData">
			<uni-forms-item name="captchaCode">
				<input @input="captchaCodeInputHandle" :disabled="captchaCodeIsDisabled"
					:style="{opacity:(captchaCodeIsDisabled?'0':'1')}"
					style="transition: 1.2s all;height: 3rem;font-size: 1.5rem;line-height: 1.5rem;box-sizing: border-box;text-align: center;background-color: #eceff1;border-radius: 1.5rem;"
					type="number" maxlength="6" v-model="PhoneCodeData.captchaCode">
			</uni-forms-item>
		</uni-forms>


		<button :loading="btnIsLoading" @click="submitHandle" :disabled="btnIsDisabled"
			style="background-color: #81d4fa;">{{btnLabel}}</button>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				PhoneNumberData: {
					phoneNumber: ''
				},
				PhoneCodeData: {
					captchaCode: ''
				},
				returnCode: null,
				btnLabel: "下一步",
				btnIsDisabled: true, //输入电话号码 正确就给下一步
				phoneNumberIsDisabled: false, // 电弧号码输入框是否禁用
				captchaCodeIsDisabled: true, // 验证码输入框是否禁用
				btnIsLoading: false, // 按钮是否显示加载中
			}
		},
		onReady() {
			this.$refs.PhoneNumberForm.setRules(this.userRules); // 电话号码的验证
			this.$refs.PhoneCodeForm.setRules(this.userRules); // 电话号码的验证
		},
		methods: {
			// 验证码输入事件
			captchaCodeInputHandle(e) {
				// 验证码长度没达到6位我就禁用按钮不给提交
				if (e.detail.cursor === 6 || e.detail.value.lenght === 6) {
					this.btnIsDisabled = false;
				} else {
					this.btnIsDisabled = true;
				}

			},
			// 按钮点击事件
			async submitHandle() {
				// 第一次是电话号码输入，这里已经是正确的电话号码了，在这里就发短信
				if (this.btnLabel === "下一步") {
					this.btnIsDisabled = true; //重新禁用按钮
					await this._getCode({
						"phone": this.PhoneNumberData.phoneNumber
					})
					this.phoneNumberIsDisabled = true; // 禁用电话号码输入框
					this.captchaCodeIsDisabled = false // 解除验证码输入框的禁用,让disable为false
					this.btnLabel = "提交"; // 重新变成提交
					return;
				}

				if (this.btnLabel === "提交") {
					this.btnIsLoading = true; // 按钮显示加载中，
					this.btnLabel = "请稍后"
					this.btnIsDisabled = true; // 禁用按钮中		

					await this.$refs.PhoneCodeForm.validate().then(res => {
						// 验证码匹配
						this._sendUserInfo({
							phoneNumber: this.PhoneNumberData.phoneNumber
						})
						this.btnIsLoading = false;

						setTimeout(() => {
							uni.showToast({
								title: "登录失败请检查该手机号码是否注册",
								icon: "none"
							});
							uni.redirectTo({
								url: '/pages/userInfo/phoneNumberLogin/phoneNumberLogin'
							})
						}, 1500)

					}).catch(err => {
						console.log(err)
						// 进入错误表示验证码不正确
						this.btnIsLoading = false;
						this.btnLabel = "提交"
					})
				}
			},
			// 发送用户数据到后端
			async _sendUserInfo(data) {
				const userInfo = await this.$http.user_login_with_phoneNumber(data);
				if (userInfo) { //登录成功
					this.updateUserInfo(userInfo);
					uni.showToast({
						title: "用户登录成功",
						icon: "none"
					});
					// 登录成功回到首页
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/index/index'
						})
					}, 1500)
				}
			},
			// 获取验证码
			async _getCode(data) {
				const res = await this.$http.get_verification_code(data);
				if (res.mobileCode) {
					this.returnCode = res.mobileCode
				}
			},

			// 判断电话号码的验证状况输入正确的号码才给解锁下一步
			updateData(e) {
				if (!e) {
					console.log('正确')
					this.btnIsDisabled = false; //解锁下一步
				} else {
					console.log('错误')
				}
			},
			// 发送数据给后端
			async _sendUserInfo(data) {
				const userInfo = await this.$http.user_login_with_phoneNumber(data);
				if (userInfo) { //登录成功
					this.updateUserInfo(userInfo);
					uni.showToast({
						title: "用户登录成功",
						icon: "none"
					});
					// 登录成功回到首页
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/index/index'
						})
					}, 1500);
				} else {
					uni.showToast({
						title: "登录失败此号码可能没有绑定账户",
						icon: "none"
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/index/index'
						})
					}, 1500);
				}
			},
			...mapMutations(['updateUserInfo']),
		},
	}
</script>



<style lang="scss" scoped>
	.FromsContainer {
		padding: 0 1rem;

		.title {
			font-size: 1.3rem;
			font-weight: bold;
		}

	}
</style>
