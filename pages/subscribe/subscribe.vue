<template>
	<view class="subscribe-content-container">
		<navBartop></navBartop>
		<view class="content" :style="{height:`calc(100vh - ${NavbarHeight}px )`}" style="width: 100vw;">
			<view style="text-align: center;color: #898989;padding-top: 2rem;" v-if="!authorList.length"
				class="no-data">
				暂无订阅，快去看看吧
			</view>
			<view class="author-container" v-for="item in authorList" :key="item._id">
				<view class="author-item" @click="toAuthorArticle(item)">
					<view class="avatar">
						<image :src="item.userInfo.avatar" mode="aspectFill"></image>
					</view>
					<view class="info">
						<text>{{item.userInfo.name}}</text>
					</view>

					<view class="btn">
						<button @click.stop="unfollowHandle(item._id)" size="mini" type="default" :plain="true"
							style="padding: 0 0.4rem;margin: 0;border-radius: 0;height: 1.5rem;line-height: 1.5rem;border: 0;">取消订阅</button>
					</view>
				</view>
			</view>


		</view>
	</view>
</template>

<script>
	import navBartop from "../../components/NavBar-Top/NavBar-Top.vue"
	export default {
		onLoad() {
			// 验证用户登录没有，如果没有登录抓紧去登录
			// #ifdef MP-WEIXIN
			if (!this.USERINFO) {
				uni.redirectTo({
					url: '/pages/userInfo/userLogin/userLogin'
				})
			}
			// #endif


			this.USERINFO && this._getFollowAuthors({
				"userId": this.USERINFO._id
			})
		},
		onShow() {
			this.USERINFO && this._getFollowAuthors({
				"userId": this.USERINFO._id
			})
		},
		data() {
			return {
				NavbarHeight: 50,
				authorList: []
			}
		},
		components: {
			navBartop,
		},
		methods: {
			async _getFollowAuthors(data) {
				const autorArr = await this.$http.get_follow_authors(data);
				this.authorList = autorArr;
			},
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.NavbarHeight = menuButtonInfo.top + menuButtonInfo.height;
				// #endif
			},
			toAuthorArticle(item) {
				uni.navigateTo({
					url:`/pages/author_article/author_article?author=${JSON.stringify(item)}`
				})
			},
			async unfollowHandle(id) {
				console.log(id)
				const temparr = [];
				this.authorList.map(item => {
					if (item._id !== id) {
						temparr.push(item)
					} else {
						return
					}
				});
				this.authorList = temparr; // 刷新被删除的用户
				const res = await this.$http.update_follow_authors({
					authorId: id, // 文章作者的id
					userId: this.USERINFO._id, // 用户的id
				});

				let followAuthorArr = [...this.USERINFO.followAuthors];
				// 文章id是作者id，_id是文章的表的id,文章页面的关注作者关注的是id，如果是点赞就需要文章_id
				if (followAuthorArr.includes(id)) {
					followAuthorArr = followAuthorArr.filter(item => item != id);
				} else {
					followAuthorArr.push(id);
				}
				this.updateUserInfo({
					...this.USERINFO,
					followAuthors: followAuthorArr
				});


			}
		},
		created() {
			this.getSystemInfo()
		}

	}
</script>

<style lang="scss" scoped>
	* {
		padding: 0;
		margin: 0;
	}

	page {
		height: 100vh;
		width: 100vw;
		display: flex;
	}

	.subscribe-content-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;

		.content {
			box-sizing: border-box;
			overflow-y: scroll;

			.author-container {
				width: 100vw;

				.author-item {
					margin: 0.1rem 0rem;
					width: 100vw;
					height: 2rem;
					background-color: #f5f5f5;
					display: flex;
					align-items: center;
					padding: 0 1rem;
					position: relative;

					.avatar {
						width: 1.5rem;
						height: 1.5rem;
						border-radius: 50%;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.info {
						max-width: 5rem;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}

					.btn {
						position: absolute;
						right: 3rem;
						overflow: hidden;
						border-radius: 0.2rem;
						background-color: #999;
					}
				}
			}
		}
	}
</style>
