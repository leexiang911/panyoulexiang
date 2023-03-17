<template>
	<view class="CommentMasker">
		<uni-popup ref="popup" :isMaskClick="false" type="bottom">

			<view class="popup-wrapper">
				<view class="popup-header">
					<view class="popup-header-item" @click="closePopupMasker">
						取消
					</view>
					<view class="popup-header-item" @click="sendCommentData">
						发布
					</view>
				</view>

				<view class="popup-content">
					<textarea class="popup-content-textarea" v-model.trim="commentsVal" placeholder="请输入评论内容"
						maxlength="200"></textarea>
					<view class="popup-content-count">
						{{commentsVal.length}}/200
					</view>
				</view>
			</view>

		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "CommentMasker",
		data() {
			return {
				commentsVal: '', // 评论内容绑定的值
			};
		},
		props: {
			showPopup: Boolean
		},
		created() {

		},
		watch: {
			showPopup(newVal) {
				// 监听父组件传入的值，来确定是否显示和隐藏
				newVal ? this.$refs.popup.open() : this.$refs.popup.close();
			}
		},
		mounted() { // dom加载完毕
			// this.$refs.popup.open()
		},
		methods: {
			/* 关闭弹窗的触发事件 */
			closePopupMasker() {
				this.$emit('closePopupMasker', false);
			},
			sendCommentData() {
				// 没有内容不发送给提示
				if (!this.commentsVal) {
					uni.showToast({
						title: "请输入评论内容",
						icon: 'none'
					});
					return;
				}
				// 有内容,发送数据
				this.$emit("sendCommentData", this.commentsVal);
				// 清空数据
				setTimeout(() => {
					this.commentsVal = '';
				}, 500)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.CommentMasker {
		.popup-wrapper {
			background-color: #f7f7f7;

			.popup-header {
				display: flex;
				font-size: 1rem;
				color: #666;
				justify-content: space-between;
				border-bottom: 1px solid #e5e5e5;

				.popup-header-item {
					height: 2rem;
					line-height: 2rem;
					padding: 0 0.5rem;
				}
			}

			.popup-content {
				width: 100%;
				padding: 0.5rem;
				box-sizing: border-box;
				position: relative;

				.popup-content-textarea {
					width: 85vw;
					height: 10rem;
					padding: 0.5rem;
					background-color: #f1f1f1;
					margin: 0 auto;
					border-radius: 0.8rem;
				}

				.popup-content-count {
					position: absolute;
					bottom: 1rem;
					right: 1rem;
					color: #999;
					font-size: 0.75rem;
				}
			}
		}
	}
</style>
