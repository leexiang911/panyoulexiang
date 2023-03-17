<template>
	<!-- :style="{paddingTop:marginTopHeight + 'px'}" -->
	<view class="UserAndSetting">
		阿斯顿发生as发d
		dsfa 
		adfaf sd 
		asdf 
		as的fa
	</view>
</template>

<script>
	export default {
		name: "UserAndSetting",
		data() {
			return {

			};
		},
		props: {
			marginTopHeight: Number
		},
		created() {
			console.log(this.marginTopHeight)
		},
		methods: {
			closeBtnHandle() {
				console.log(777)
				console.log(this.$emit("closeBtnHandle", false))
			}
		},
	}
</script>

<style lang="scss">
	* {
		margin: 0;
		padding: 0;
	}

	page {
		width: 100vw;
		height: 100vh;
	}

	.UserAndSetting {
		width: 100vh;
		height: 100%;
		background-color: #f40;

		.header {
			width: 100vw;
			height: 100vh;
			background-color: #fff;
			display: flex;
			// justify-content: space-between;
			flex-wrap: nowrap;
			flex-direction: column;
			align-items: center;

			// 关闭按钮
			.close_btn-container {
				position: relative;
				width: 100%;
				height: 2rem;

				
			}

			// 欢迎图片
			.loginImgcontainer {
				width: 50vw;
				height: 50vw;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}


			.Welcomewords {
				padding: 1rem;
			}

			.login_btn {
				width: 6rem;
				height: 4rem;
				border-radius: 0.5rem;
				overflow: hidden;
				color: #6fc;
			}
		}
	}
</style>
