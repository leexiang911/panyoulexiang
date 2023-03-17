<template>
	<view class="container">
		<view class="item">
			<text class="title">注册</text>
			<view class="content">
				注册账号尽量使用自己的邮件地址做账号名，这样就比较容易记住，头像可以选择我提供的默认的，当然也可以自己上传。注册并登录账号后，可以绑定手机号码，方便忘记密码的时候可以登录账号，找回密码
			</view>
		</view>
		
		<view class="item">
			<text class="title">发帖</text>
			<view class="content">
				发帖可以选择四种模式，分别是纯文本，图文，大图，多图模式。这几种模式和文章摘要只是做到一个吸引别人点进来看的作用，然并卵。发帖时候尽量选择好分类，方便其他人寻找，在正文框中输入内容后记得保存才能发布
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

			.content {
				padding: 0 0.5rem;
				font-size: 0.8rem;
			}
		}
	}
</style>
