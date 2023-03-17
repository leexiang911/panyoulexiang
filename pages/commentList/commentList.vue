<template>
	<view>
		<view class="comment-content-conatiner" v-for="item in commentList" :key="item.comment_id">
			<CommentBox @commentReply="commentReplyHandle" :commentData="item"></CommentBox>
		</view>

		<uni-load-more v-if="commentList.length===0 || commentList.length > 5" :status="loading" :contentText="{
			contentdown: '上拉加载更多',
			contentrefresh: '正在加载...',
			contentnomore: '没有评论了'
		}"></uni-load-more>
		<!-- 评论的弹窗 -->
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event"
			@sendCommentData="_sendCommentData($event)"></CommentMasker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleId: '', // 文章id
				commentList: [], // 评论列表
				loading: "loading", // 加载状态
				page: 1, // 页码
				pageSize: 6, // 页容量
				showPopup: false, // 弹窗默认不显示
				replyData:{},// 回复对象
			}
		},
		methods: {
			async _getCommentList() {
				const list = await this.$http.get_list_of_comments({
					articleId: this.articleId, // 文章id
					pageSize: this.pageSize,
					page: this.page
				});
				if (list.length === 0) {
					this.loading = "noMore";
					return;
				}
				let oldList = JSON.parse(JSON.stringify(this.commentList)); // 追加操作
				console.log(oldList)
				oldList.push(...list); // 追加造成
				this.commentList = oldList //追加操作
			},
			commentReplyHandle(data) {
				this.replyData = {
						comment_id: data.comment.comment_id,
						is_reply: data.isReply
					},
					data.comment.reply_id && (this.replyData.reply_id = data.comment.reply_id)
				this.openMaskerComment();
			},
			// 打开评论弹出层
			async openMaskerComment() {
				// 验证是否登录
				await this.checkedisLogin();
				// 登录了再打开弹窗
				this.showPopup = true;
			},
			// 发送评论到后端
			async _sendCommentData(content) {
				const res = await this.$http.update_comments({
					userId: this.USERINFO._id,
					articleId: this.articleId,
					content,
					...this.replyData
				});
				uni.showToast({
					title: res.msg ? res.msg : "评论成功",
					icon: 'success'
				});
				this.showPopup = false;
				this.replyData = {};
				this.page = 1;
				this.commentList = [];
				this.loading = 'loading';
				this._getCommentList();
			}
		},
		// 这是页面滑动到底部的钩子函数
		onReachBottom() {
			if (this.loading === 'noMore') return;
			this.page++;
			this._getCommentList()
		},
		onLoad(props) {
			this.articleId = props.id; // 文章详情页面传过来的id
			this._getCommentList(); // 调用文章评论获取
		}
	}
</script>

<style>

</style>
