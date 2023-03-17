<template>
	<view class="found-content-container">
		<!-- 顶部栏 -->
		<navBartop></navBartop>
		<view class="fund-content">
			<!-- 公告 -->
			<view class="btn"
				style="background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/fundpage/bulletin.svg);">
				<button @click="goAnnouncementPage" size="mini" :plain="true" type="default">
					<text>公告</text>
				</button>
			</view>
			<!-- 约定 -->

			<view class="btn"
				style="background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/fundpage/conventions.svg);">
				<button @click="goConventionsPage" size="mini" :plain="true" type="default">
					<text>约定</text>
				</button>
			</view>
			<!-- 赞助 -->
			<view class="btn"
				style="background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/fundpage/vote.svg);">
				<button arai-label='暂时禁用' disabled="true" @click="goVotePage" size="mini" :plain="true" type="default">
					<text>投票</text>
				</button>
			</view>
			<!-- 投票 -->

			<view class="btn"
				style="background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/fundpage/sponsor.svg);">
				<button arai-label='暂时禁用' disabled="true" @click="goSponsorPage" size="mini" :plain="true" type="default">
					<text>赞助</text>
				</button>
			</view>

		</view>

	</view>
</template>

<script>
	import navBartop from "../../components/NavBar-Top/NavBar-Top.vue"
	export default {
		data() {
			return {

			}
		},
		components: {
			navBartop,
		},
		methods: {
			goAnnouncementPage() {
				uni.navigateTo({
					url: '/pages/announcement/announcement'
				});
			},
			goConventionsPage() {
				uni.navigateTo({
					url: '/pages/conventions/conventions'
				});
			},
			goVotePage() {
				uni.navigateTo({
					url: '/pages/vote/vote'
				});
			},
			goSponsorPage() {
				uni.navigateTo({
					url: '/pages/sponsor/sponsor'
				});
			}
		},
		created() {},
		onLoad() {}
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

	.found-content-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;

		.fund-content {
			box-sizing: border-box;
			padding-top: 1rem;

			.btn {
				box-sizing: border-box;
				height: 2rem;
				width: 100%;
				border-bottom: 1px solid #e0e0e0;
				background-repeat: no-repeat;
				background-position: 0.5rem 0;

				button {
					border-radius: 0;
					padding: 0;
					margin: 0;
					width: 100vw;
					border: 0;

					text {
						display: block;
						font-weight: bold;
						padding-left: 3rem;
						width: max-content;
					}
				}
			}
		}
	}
</style>
