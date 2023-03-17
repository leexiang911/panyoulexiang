<template>
	<view class="AvatarsContainer">
		<view class="" v-if="!avatarList">
			暂时没有图片
		</view>

		<view class="AvatarList">
			<view class="imgContainer" @click="selecterImg(item,index)" v-for="(item,index) in avatarList"
				:key="item._id" :style="{backgroundImage: `url(${item.url})`}">

				<view style="width: 100%;height: 100%;" v-if="activeIndex===index && !addAvatar ">
					<image src="../../static/avatar_img/icon/select.svg" mode="aspectFill"
						style="width: 100%;height: 100%;"></image>
				</view>
			</view>
			<view @click="addAvatarHandle" class="imgContainer" style="border-radius: 50%;overflow: hidden;">
				<!-- 第一张图片只是一个作为样式的图片，只是有一个加号的标志 -->
				<image v-if="!uploadTempImgUrl" src="../../static/avatar_img/icon/addAvatar.svg" mode="aspectFill">
				</image>
				<image v-if="uploadTempImgUrl" :src="uploadTempImgUrl" mode=""></image>
			</view>
		</view>

		<view class="btnContainer">
			<text class="CancelImg" @click="cancleImgHandle">取消</text>
			<text class="SaveImg" @click="saveAvatarPicture">保存</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Avatars",
		components: {},
		data() {
			return {
				// 选中哪个头像就在上面显示一张图片
				activeIndex: 0, //选中第几张图片，方便添加选中的样式
				selectAvatarUrl: '', //选中的图片的url，如果用户上传了图片就把他变成上传的图片的url地址
				addAvatar: null, // 默认是没有用户添加照片，如果用户添加照片就给他表示true
				uploadTempImgUrl: '', // 图片要上传的暂时的地址，如果选中图片，就给他放到里面，当用户点击保存再上传
				uploadTempImgName: '', //图片在服务器叫的名字
			};
		},
		props: {
			avatarList: Array
		},
		methods: {
			// 取消选择图片事件事件
			cancleImgHandle() {
				this.$emit("deselectAvatar");
			},
			// 选择已经有的头像
			selecterImg(item, index) {
				this.addAvatar = null; // 既然选中已经有的头像那么就把想上传的头像给咔嚓了
				this.activeIndex = index; // 选中的图标
				this.$emit("selectThepicture", item.url);
				this.selectAvatarUrl = item.url; // 选中那个图片就添加哪个样式
				this.uploadTempImgUrl = ''; // 这里是做一个处理，如果选过自己上传图片，就变成空
			},
			// 选中自己的头像
			addAvatarHandle() {
				let This = this;
				this.selectAvatarUrl = null; // 选中上传的头像后，系统头像就不给用了
				this.activeIndex = null;
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					success(res) {
						This.uploadTempImgUrl = res.tempFilePaths[0]
						This.uploadTempImgName = Date.now() + res.tempFilePaths[0].substring(res.tempFilePaths[0]
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
			// 保存头像
			async saveAvatarPicture() {
				let This = this;
				if (this.uploadTempImgUrl) {
					await uniCloud.uploadFile({
						filePath: this.uploadTempImgUrl,
						cloudPath: this.uploadTempImgName,
						success(e) {
							console.log(e.filePath);
							This.$emit("saveAvatarPictureHandle", e.filePath);
						},
						onUploadProgress: function(progressEvent) {
							/* 	console.log(progressEvent);
								var percentCompleted = Math.round(
									(progressEvent.loaded * 100) / progressEvent.total
								); */
						},
					});
					return;
				}
				this.$emit("saveAvatarPictureHandle", this.selectAvatarUrl);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.AvatarsContainer {
		width: 80vw;
		height: 105vw;
		background-color: #fff;
		border-radius: 0.35rem;

		.btnContainer {
			display: flex;
			justify-content: space-between;
			height: 10vw;
			line-height: 10vw;
			box-sizing: border-box;
			border-top: 1px solid #eceef1;

			.CancelImg {
				width: 40%;
				text-align: center;
				box-sizing: border-box;
				border: 1px solid #eceef1;
				margin-left: 0.5rem;
				margin-right: 0.5rem;
				margin-top: 0.5rem;
				height: 1.6rem;
				font-size: 0.8rem;
				line-height: 1.6rem;
				border-radius: 0.2rem;
				background-color: #EEEEEE;
			}

			.SaveImg {
				width: 100%;
				text-align: center;
				border: 1px solid #eceef1;
				box-sizing: border-box;
				margin-right: 0.5rem;
				margin-top: 0.5rem;
				height: 1.6rem;
				font-size: 0.8rem;
				line-height: 1.6rem;
				border-radius: 0.2rem;
				color: #6cf;
			}

		}

		.AvatarList {
			width: 80vw;
			height: 90vw;
			background-color: #fff;
			overflow-y: scroll;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: flex-start;

			.imgContainer {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				margin: 0.5rem;
				background-size: cover;

				// background-color: #666;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
