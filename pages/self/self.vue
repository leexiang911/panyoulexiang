<template>
	<view class="AccountSettingsContainer">
		<view class="description">头像设置(点击头像可以上传新的图片)</view>
		<view class="avatar-container">
			<view class="avatar" @click="updateAvatar">
				<image v-if="avatar" :src="avatar" mode="aspectFill" style="width: 100%;height: 100%;opacity: 0.75;">
				</image>
			</view>
		</view>

		<view class="description">账户名/邮箱</view>
		<view class="loginName-container">
			<input type="text" v-model="loginName" maxlength="18">
		</view>

		<view class="description">昵称</view>
		<view class="nickName-container">
			<input type="text" v-model="nickName" maxlength="18">
		</view>
		<view class="description">电话号码</view>
		<view class="phoneNumber-container">
			<input type="text" v-model="phoneNumber" placeholder="请输入真实有效的号码方便找回账号" maxlength="13">
		</view>

		<view class="description">新密码(不填写表示不修改密码)</view>
		<view class="password-container">
			<input type="password" v-model="password" placeholder="请输入新密码" maxlength="18">
			<input v-if="password.length" type="password" v-model="confirmPassword" placeholder="请确认新密码" maxlength="18">
		</view>

		<button @click="sumbitHandle">更新账号设置</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '', // 头像
				loginName: "", // 登录名字
				password: "", //密码
				phoneNumber: "", //电话号码
				nickName: "", // 名字
				confirmPassword: "",
				avatarUrl: null,
				tempAvatarUrl: null,
				userId: '',
				pd: ""
			}
		},
		methods: {
			async getMyAccount() {
				const {
					data
				} = await this.$http.get_user_account({
					"userId": this.USERINFO._id
				})
				this.avatar = data.userInfo.avatar;
				this.loginName = data.loginName;
				this.nickName = data.userInfo.name;
				this.userId = data._id;
				this.pd = data.password
			},
			updateAvatar() {
				let This = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					success(res) {
						const uploadTempImgUrl = res.tempFilePaths[0];
						This.avatar = uploadTempImgUrl;
						This.tempAvatarUrl = uploadTempImgUrl
						const uploadTempImgName = Date.now() + res.tempFilePaths[0].substring(res.tempFilePaths[0]
							.length - 20);
						uni.showToast({
							title: "上传成功",
							icon: "success"
						})
					},
					complete(e) {
						console.log(e)
					}
				})
			},
			async sumbitHandle() {
				if (this.password) {
					if (this.password.length < 10) {
						uni.showToast({
							title: "密码不能小于十位数",
							duration: 2500,
							icon: 'none'
						});
						return;
					}

					if (this.password !== this.confirmPassword) {
						uni.showToast({
							title: "两次密码不一致,请检查",
							duration: 2500,
							icon: 'none'
						});
						return;
					}
				}
				this.tempAvatarUrl && await this.UpdateImg();

				if (this.avatarUrl) {
					this.avatar = this.avatarUrl
				}

				let pwd = ''
				if (this.confirmPassword) {
					pwd = this.confirmPassword
				} else {
					pwd = this.pd
				}

				await this.updateAccount({
					"userId": this.userId,
					"avatar": this.avatar,
					"loginName": this.loginName,
					"name": this.nickName,
					"phoneNumber": this.phoneNumber,
					"password": pwd
				})
			},
			// 真正的上传图片
			async UpdateImg() {
				const imgName = Date.now().toString() + this.tempAvatarUrl.substr(this.tempAvatarUrl.lastIndexOf("."));
				const result = await uniCloud.uploadFile({
					filePath: this.tempAvatarUrl,
					cloudPath: imgName,
					onUploadProgress: function(progressEvent) {
						console.log(progressEvent);
						var percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
					}
				});
				this.avatarUrl = result.fileID;
			},
			async updateAccount(data) {
				const res = await this.$http.update_my_account(data)
				this.updateUserInfo(res.data);
				uni.showToast({
					title:"更新账户信息成功",
					icon:'none',
					duration:1500
				});
				setTimeout(()=>{
					uni.redirectTo({
						url:'/pages/index/index'
					})
				},1000)
			}
		},
		onLoad() {
			if (!this.USERINFO) {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			}
			this.getMyAccount()

		}
	}
</script>

<style lang="scss" scoped>
	.AccountSettingsContainer {
		padding: 0 1rem;
		height: 100vh;
		overflow-y: scroll;

		.description {
			color: #acb2c0;
			font-size: 0.8rem;
			font-weight: 400;
		}

		.avatar-container {
			width: 100%;
			height: 30vw;
			box-sizing: border-box;

			.avatar {
				width: 30vw;
				height: 30vw;
				background-color: #fff;
				background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/updateImg.svg);
				border: 1px solid #999;
				box-sizing: border-box;
				z-index: 8;

			}

			margin-bottom: 0.5rem;
		}

		.loginName-container {
			margin-bottom: 0.5rem;

			input {
				border: 1px solid #666;
				border-radius: 0.2rem;
			}
		}

		.nickName-container {
			margin-bottom: 0.5rem;

			input {
				border: 1px solid #666;
				border-radius: 0.2rem;
			}
		}

		.phoneNumber-container {
			margin-bottom: 0.5rem;

			input {
				border: 1px solid #666;
				border-radius: 0.2rem;
			}
		}

		.password-container {
			margin-bottom: 0.5rem;

			input {
				border: 1px solid #666;
				border-radius: 0.2rem;
				margin-bottom: 0.5rem;
			}
		}
	}
</style>
