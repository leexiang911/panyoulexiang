<template>
	<view class="container">
		<view class="item">
			<text class="title">欢迎您</text>
			<view class="content">
				这是本人开发的微信小程序，欢迎大家来分享自己的资源，在这你可以分享书籍，音乐，影视作品，精品软件
			</view>
		</view>
		<view class="item">
			<text class="title">反馈</text>
			<view class="content">
				如果你有好的建议或者意见你可以给我发邮件51419474@qq.com,我一个人开发的小程序，难免会有点小bug，希望理解，界面也比较简约。
			</view>
		</view>
		<view class="item">
			<text class="title">无障碍</text>
			<view class="content">
				我知道有盲人朋友也会在网上听音乐，听书，所以尽我最大努力优化了无障碍，删除了盲人模式下不必要读的图片，还要增加了对某些按钮和输入框的描述，但是好多地方还是有问题，在网页上就可以正常使用，只有等后续微信官方升级小程序的库。总的来说不影响使用
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100vw;
		height: 100vh;
		overflow-y: scroll;

		.item {
			text {
				font-size: 1.2rem;
				display: block;
				text-align: center;
				width: 100vw;
			}
			.content{
				padding: 0 0.5rem;
				font-size: 0.8rem;
			}
		}
	}
</style>
