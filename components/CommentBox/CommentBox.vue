<template>
	<view class="commentBox-container">
		<view class="comment-header">
			<view class="comment-header-avatar">
				<image :src="commentData.author.author_avatar"></image>
			</view>
			<view class="comment-header-info">
				<text class="title" v-if="!commentData.is_reply" >{{commentData.author.author_name}}</text>
				<text class="title" style="color: #66ccff;" v-else>{{commentData.author.author_name}}
				<text style="color: #999; font-size: 0.7rem;padding: 0.1rem;">回复</text>
				{{commentData.to}}</text>
				<view class="time">
					<uni-dateformat :date="commentData.comment_time"></uni-dateformat>
				</view>
			</view>

		</view>

		<view class="comment-content">
			<view class="content">
				{{commentData.comment_content}}
			</view>
			<view class="comment-info">
				<view @click="commentReplyHandle({comment:commentData,isReply})" class="comment-button">
					回复
				</view>
			</view>
			<!-- 子回复的展示 -->
			<view class="comment-reply-list" v-for="item in commentData.replyArr" :key="item.comment_id">
				<CommentBox :isReply="true" :commentData="item" @commentReply="commentReplyHandle"></CommentBox>
			</view>
		</view>

	</view>
</template>

<script>
	import CommentBox from '@/components/CommentBox/CommentBox.vue'
	export default {
		name: "CommentBox",
		data() {
			return {

			};
		},
		components: {
			CommentBox,
		},
		props: {
			commentData: Object,
			isReply: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			// 回复按钮的点击事件
			commentReplyHandle(data) {
				// 发送给父组件，父组件再确定是不是要打开弹窗
				if (data.isReply) {
					data.comment.reply_id = data.comment.comment_id;
					data.comment.comment_id = this.commentData.comment_id;
				}
				console.log(data)
				// return
				this.$emit('commentReply', data)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.commentBox-container {
		margin: 0.2rem 0.8rem;
		padding: 0.2rem 0;
		font-size: 0.85rem;
		border-left: 1px solid #999;

		.comment-header {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.comment-header-avatar {
				flex-shrink: 0;
				width: 1.85rem;
				height: 1.85rem;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.comment-header-info {
				display: flex;
				justify-content: flex-start;
				flex-direction: column;

				.time {
					font-size: 0.7rem;
					color: #999;
				}
			}

		}

		.comment-content {

			.content {
				padding-left: 1rem;
				font-size: 0.8rem;
				white-space: normal;
				word-break: break-all;
			}

			.comment-info {
				margin-top: 0.2rem;
				display: flex;

				.comment-button {
					font-size: 0.65rem;
					padding: 0.1rem 0.5rem;
					border-radius: 0.8rem;
					border: 1px solid #999;
					background-color: #f5f5f5;
					margin-left: 0.5rem;
				}
			}
		}
	}
</style>
