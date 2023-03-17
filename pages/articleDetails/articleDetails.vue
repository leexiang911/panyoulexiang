<template>
	<view class="articleDetailsContainer" :style="{paddingTop:topPadding + 'px'}">
		<!-- 填充顶部 -->
		<view class="top" style="position: fixed;top: 0;left: 0;width: 100vw;background-color: #eee;z-index: 9;"
			:style="{height:topMargin+ 'px'}"></view>
		<view class="Top_title"
			style="position: fixed;width: 100%;text-align: center;display: flex;align-items: center;overflow: hidden;"
			:style="{left:0,top:topMargin + 'px',height:topHeight + 'px'}">
			<image aria-label="返回按钮" @click="getBack" src="../../static/articleDetails/back.svg" mode="aspectFill"
				style="height: 3rem;width: 3rem;margin-right: 4rem;border-radius: 50%;"></image>
			文章详情
		</view>

		<!-- 顶部内容，包含标题，发帖人的信息 -->
		<view class="detailTop">
			<view class="title">{{articleData.title}}</view>
			<view class="authorInfo">
				<view class="avatarLogo">
					<image :src="articleData.avatar" mode="aspectFill" style="width: 100%;height: 100%;"></image>
				</view>

				<view class="time_and_name">
					<text class="name">{{articleData.name}}</text>
					<view class="time">{{articleData.creatTime}} {{articleData.numberOfReads}}浏览
						{{articleData.numberOfLikes}}赞
					</view>
				</view>

				<view class="follow_btn">
					<button @click="_followAuthor" :plain="true" style="background-color: #6cf;border-color: #aaa;"
						size="mini">{{isFollowAuthor?"取消关注":"+关注"}}</button>
				</view>

			</view>
		</view>
		<!-- 不需要引入，可直接使用 ，这是解析富文本的组件，用作文章内容的解析-->
		<mp-html :selectable="true" style="font-size: 0.8rem;white-space: normal;word-break: break-all;" :content="html" />

		<!-- 底部工具栏 -->
		<view class="bottom-toolbar">
			<!-- 添加到仓库的按钮 -->
			<!-- <view class="add"></view> -->
		</view>
		<!-- 这是底部评论内容给的展示 -->
		<view class="comment-content-container">
			<text v-if="listOfComments.length"
				style="border-bottom: 1px dashed #999;display: block;padding-left: 1rem;">最新评论</text>
			<view v-if="listOfComments.length" style="margin-bottom: 0.5rem;background-color: #f5f5f5; "
				v-for="item in listOfComments" :key="item.comment_id">
				<CommentBox :commentData="item" @commentReply="commentReply"></CommentBox>
			</view>
			<text v-if="!listOfComments.length">暂无评论</text>
		</view>

		<!-- 底部填充物 -->
		<view class="bottom">

		</view>
		<!-- 底部评论的按钮和icon等功能 -->
		<view class="detail_bottom">
			<view @click="openMaskerComment" class="inputcontainer">
				谈谈你的看法
				<image aria-hidden="true"
					src="https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/revise.svg" mode="aspectFill"
					style="width: 1.3rem;height: 1.3rem;"></image>
			</view>
			<view class="commentsIcon" @click="goCommentsPageHandle"></view>
			<view class="likeIcon" @click="_likeHandle">
				<image v-if="isLiked"
					src="https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/like_fill.svg"
					mode="aspectFill" style="width: 100%;height: 100%;"></image>
			</view>
			<view @click="_thumbUpHandle" class="thumbs-upIcon">
				<image v-if="isThumbUp"
					src="https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/thumb_up_fill.svg"
					mode="aspectFill" style="width: 100%;height: 100%;"></image>
			</view>
		</view>
		<!-- 评论输入的弹出层 -->
		<CommentMasker :showPopup="showPopup" @closePopupMasker="showPopup=$event"
			@sendCommentData="_sendCommentData($event)"></CommentMasker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				html: '<div>你好啊</div>',
				topPadding: 20, // 顶部适配专用
				topMargin: 10, //顶部适配专用
				topHeight: 10,
				articleData: null,
				showPopup: false, // 是否展示评论框
				listOfComments: [], // 评论列表
				replayData: {}
			}
		},
		computed: {
			// 是否关注作者
			isFollowAuthor() {
				return this.articleData && this.USERINFO && this.USERINFO.followAuthors.includes(this.articleData
					.authorId);
			},
			// 喜欢过了吗
			isLiked() {
				return this.articleData && this.USERINFO && this.USERINFO.favoritesArticleList.includes(this.articleData
					._id);
			},
			// 点赞过了吗
			isThumbUp() {
				return this.articleData && this.USERINFO && this.USERINFO.alreadyLiked.includes(this.articleData._id);
			}
		},
		onLoad(...options) { // 加载就获取到参数，通过参数赋值给这里的数据，这样页面加载比较快，
			this.articleData = JSON.parse(options[0].params);
			// 然后通过id慢慢获取正文
			this._getArticleDetails(); //获取文章的详情
			this._getArticleReviews(); // 获取文章的评论
		},
		created() {
			this.getSystemInfo();
		},

		methods: {
			// 获取设备顶部胶囊高度
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.topPadding = menuButtonInfo.top + menuButtonInfo.height; //按钮举例顶部和按钮的高度
				this.topMargin = menuButtonInfo.top;
				this.topHeight = menuButtonInfo.height;
				// this.NavbarContentHeight = menuButtonInfo.height; //按钮高度
				// this.NavbarContentWidth = menuButtonInfo.left; //按钮举例左边
				// #endif
			},
			// 左上角的返回按钮
			getBack() {
				uni.navigateBack()
			},
			// 请求文章内容函数
			async _getArticleDetails() {
				const {
					content, // 文章内容
					numberOfReads
				} = await this.$http.get_article_details({
					"article_id": this.articleData._id
				});
				this.html = content; // 正文内容赋值
				this.articleData.numberOfReads = numberOfReads; // 阅读量赋值
			},
			// 这是点击评论打开弹窗的方法
			async openMaskerComment() {
				// 先检查用户有没有登录，如果登录了就给评论，反之亦然
				await this.checkedisLogin()
				this.showPopup = true;
			},
			// 子组件CommentMasker $emit过来的事件,子组件评论过来的数据，让我们发送给后端
			async _sendCommentData(value) {
				// 发送评论请求
				const res = await this.$http.update_comments({
					userId: this.USERINFO._id, // 评论用户的id
					articleId: this.articleData._id, // 被评论的文章的id
					content: value, //评论的内容
					...this.replayData
				});
				// 提示框
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
				// 关闭弹出层
				this.showPopup = false;
				// 修改评论内容成功后进行数据更新
				this.replayData = {};
				this._getArticleReviews(); // 获取文章的评论
			},
			// 获取文章评论的列表
			async _getArticleReviews() {
				const res = await this.$http.get_list_of_comments({
					"articleId": this.articleData._id
				});
				this.listOfComments = res
			},
			// 处理回复事件函数，是子组件emeit过来的
			commentReply(data) {
				this.replayData = {
					comment_id: data.comment.comment_id,
					is_reply: data.isReply
				}
				data.comment.reply_id && (this.replayData.reply_id = data.comment.reply_id)
				// 子组件传递过来的值,让我们的replayData对象有了值,就可以打开弹出层进行回复了
				this.openMaskerComment();
			},
			// 改变关注作者的状态
			async _followAuthor() {
				await this.checkedisLogin(); // 检查登录状态
				const res = await this.$http.update_follow_authors({
					authorId: this.articleData.authorId, // 文章作者的id
					userId: this.USERINFO._id, // 用户的id
				});

				// 展示是否点赞
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});

				let followAuthorArr = [...this.USERINFO.followAuthors];
				// 文章id是作者id，_id是文章的表的id,文章页面的关注作者关注的是id，如果是点赞就需要文章_id
				if (followAuthorArr.includes(this.articleData.authorId)) {
					followAuthorArr = followAuthorArr.filter(item => item != this.articleData.authorId);
				} else {
					followAuthorArr.push(this.articleData.authorId);
				}
				this.updateUserInfo({
					...this.USERINFO,
					followAuthors: followAuthorArr
				});
			},
			// 改变点爱心状态
			async _likeHandle() {
				await this.checkedisLogin(); // 先检查登录
				const res = await this.$http.update_like_articles({
					userId: this.USERINFO._id,
					articleId: this.articleData._id
				});
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})

				let likeArticleArr = [...this.USERINFO.favoritesArticleList];
				if (likeArticleArr.includes(this.articleData._id)) {
					likeArticleArr = likeArticleArr.filter(item => item != this.articleData._id);
				} else {
					likeArticleArr.push(this.articleData._id);
				}
				this.updateUserInfo({
					...this.USERINFO,
					favoritesArticleList: likeArticleArr
				});
			},
			//改变点赞状态
			async _thumbUpHandle() {
				await this.checkedisLogin(); // 先检查登录
				const res = await this.$http.update_thumb_up_article({
					userId: this.USERINFO._id,
					articleId: this.articleData._id
				});
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				let thumbUpArr = [...this.USERINFO.alreadyLiked];
				if (thumbUpArr.includes(this.articleData._id)) {
					thumbUpArr = thumbUpArr.filter(item => item != this.articleData._id);
					this.articleData.numberOfLikes -= 1; // 取消点赞
				} else {
					thumbUpArr.push(this.articleData._id);
					this.articleData.numberOfLikes += 1; // 增加点赞
				}
				this.updateUserInfo({
					...this.USERINFO,
					alreadyLiked: thumbUpArr
				});
			},
			// 跳转到评论列表页面事件
			goCommentsPageHandle() {
				console.log(this.articleData._id)
				if (!this.listOfComments.length) {
					uni.showToast({
						title: "别点击了，没有评论",
						icon: 'none'
					});
				} else {
					uni.navigateTo({
						url: `/pages/commentList/commentList?id=${this.articleData._id}`
					});
				}
			},

		},
		mounted() {

		},
	}
</script>

<style lang="scss" scoped>
	.articleDetailsContainer {
		height: 100vh;
		width: 100vw;
		overflow-y: scroll;
		box-sizing: border-box;
		background-color: #f4f4f4;

		// 顶部适配填充物
		.Top_title {
			box-sizing: border-box;
			background-color: #eee;
			backdrop-filter: blur(6px);
			z-index: 9;
		}

		// 头部
		.detailTop {
			padding: 0.5rem;
			border-bottom: 1px dotted #666;

			.title {
				font-size: 1.2rem;
				font-weight: bold;
			}

			.authorInfo {
				border-radius: 0.25rem;
				display: flex;
				position: relative;

				.avatarLogo {
					margin-left: 0.3rem;
					width: 2.4rem;
					height: 2.4rem;
					border-radius: 50%;
					overflow: hidden;
				}

				.time_and_name {
					padding-left: 0.5rem;
					white-space: nowrap;
					width: max-content;

					text {
						display: block;
					}

					.name {
						font-size: 0.8rem;
						font-weight: bold;
						height: 1.2rem;
						line-height: 1.2rem;
					}

					.time {
						height: 1.2rem;
						font-size: 0.6rem;
						color: #000;
						line-height: 1.2rem;
					}
				}

				.follow_btn {
					height: 1.2rem;
					position: absolute;
					right: 0;
					top: 0.3rem;
				}
			}
		}

		.bottom-toolbar {
			height: 2rem;
			width: 100vw;
			display: flex;
			justify-content: flex-end;

			.add {
				background-color: #fff;
				width: 1.8rem;
				height: 1.8rem;
				background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/add_save.svg);
				border-radius: 0.9rem;
				margin: 0 1rem;
			}
		}

		// 评论区
		.comment-content-container {
			margin-top: 1rem;
			background-color: #fafafa;
			border-radius: 0.25rem;
		}

		// 底部填充物
		.bottom {
			height: 2rem;
			width: 100%;
		}

		.detail_bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			height: 2rem;
			background-color: #eee;
			z-index: 9;
			backdrop-filter: blur(10px);
			box-sizing: border-box;
			border-top: 1px solid rgba(0, 0, 0, 0.1);
			padding: 0 0.5rem;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.inputcontainer {
				width: 50vw;
				height: 1.8rem;
				box-sizing: border-box;
				border-radius: 0.25rem;
				border: 1px solid rgba(0, 0, 0, 0.5);
				padding: 0 0.25rem;
				font-size: 0.8rem;
				color: #535353;
				line-height: 1.8rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.commentsIcon,
			.likeIcon,
			.thumbs-upIcon {
				width: 1.8rem;
				height: 1.8rem;
			}

			.commentsIcon {
				background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/comments.svg);
			}

			.likeIcon {
				background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/like.svg);
			}

			.thumbs-upIcon {
				background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/articleDetails/thumb_up.svg);
			}
		}
	}
</style>
