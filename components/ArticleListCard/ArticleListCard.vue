<template>
	<view class="CardContainer" v-if="item">
		<!-- 基本样式 -->
		<view class="base" v-if="myitem.articleClassification" v-for="(myitem,index) in item" :key="myitem.id"
			@click="goArticleDetailHandle(myitem,index)">

			<!-- 普通卡片，纯文本 -->
			<view class="normalText-container" v-if="myitem.articleClassification =='text'">
				<title class="content-title">
					{{myitem.abstractText}}
				</title>
				<!-- 底部信息 -->
				<view class="content-padding-bottom">
					<view class="leftInfo">
						<!-- 头像 -->
						<view class="content-padding-bottom-avatar">
							<image aria-hidden="true" :src="myitem.author.avatar" mode="aspectFill"></image>
						</view>
						<view class="authorNameAndTime">
							{{myitem.author.name}} {{myitem.author.creatTime}}
						</view>
					</view>
					<view class="rightInfo">
						{{myitem.numberOfReads}}次阅读
					</view>
				</view>
			</view>

			<!-- 两列布局，左边文字，右边图片 -->
			<view v-if="myitem.articleClassification =='text-img'" class="teletext-text-image-container">
				<view class="topArticleInfo">
					<!-- 左边文字 -->
					<view class="teletext-text-content-title">
						{{myitem.abstractText}}
					</view>
					<!-- 右边图片 -->
					<view class="teletext-text-content-image">
						<image class="prevImg" aria-hidden="true" style="border-radius: 0.2rem;"
							:src="myitem.previewTheImage" mode="aspectFill"></image>
					</view>
				</view>


				<view class="content-padding-bottom">
					<view class="leftInfo">
						<!-- 头像 -->
						<view class="content-padding-bottom-avatar">
							<image aria-hidden="true" :src="myitem.author.avatar" mode="aspectFill"></image>
						</view>
						<view class="authorNameAndTime">
							{{myitem.author.name}} {{myitem.author.creatTime}}
						</view>
					</view>
					<view class="rightInfo">
						{{myitem.numberOfReads}}次阅读
					</view>
				</view>
			</view>

			<!-- 大图模式 -->
			<view class="bagImg-container" v-if="myitem.articleClassification=='bigImg'">
				<!-- 图片容器 -->
				<view class="imageContent">
					<image :src="myitem.previewTheImage" mode="aspectFill" aria-hidden="true"></image>
				</view>
				<!-- 文本容器 -->
				<view class="textContent-title">
					{{myitem.abstractText}}
				</view>
				<!-- 底部信息 -->
				<view class="content-padding-bottom">
					<view class="leftInfo">
						<!-- 头像 -->
						<view class="content-padding-bottom-avatar">
							<image aria-hidden="true" :src="myitem.author.avatar" mode="aspectFill"></image>
						</view>
						<view class="authorNameAndTime">
							{{myitem.author.name}} {{myitem.author.creatTime}}
						</view>
					</view>
					<view class="rightInfo">
						{{myitem.numberOfReads}}次阅读
					</view>
				</view>

			</view>

			<!-- 多图模式 -->
			<!-- aria-hidden="true" -->
			<view class="columnsImage-container" v-if="myitem.articleClassification=='columnsImage'">
				<!-- 图片列表 -->
				<view class="lmageList" v-if="myitem.previewTheImageList">
					<view class="imglist-container" v-if="index<5"
						v-for="(img,index) in myitem.previewTheImageList.length" :key="img"
						:style="{width:`calc(100% / ${myitem.previewTheImageList.length})`}">
						<image aria-hidden="true" :src="myitem.previewTheImageList[index]" mode="aspectFill"
							class="imgItem"></image>
					</view>
				</view>

				<view class="title-content">
					{{myitem.abstractText}}
				</view>
				<!-- 底部信息 -->
				<view class="content-padding-bottom">
					<view class="leftInfo">
						<!-- 头像 -->
						<view class="content-padding-bottom-avatar">
							<image aria-hidden="true" :src="myitem.author.avatar" mode="aspectFill"></image>
						</view>
						<view class="authorNameAndTime">
							 {{myitem.author.name}}{{myitem.author.creatTime}}
						</view>
					</view>
					<view class="rightInfo">
						{{myitem.numberOfReads}}次阅读
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ArticleListCard",
		data() {
			return {

			};
		},
		props: {
			item: Array,
		},
		methods: {
			// 跳转到文章详情页面的函数
			goArticleDetailHandle(item, index) {

				const {
					title, // 标题
					numberOfLikes, // 点赞数
					numberOfReads, // 阅读数
					_id, // id
				} = this.item[index];
				const {
					avatar,
					name,
					creatTime,
					authorId,
				} = this.item[index].author

				const params = {
					title,
					numberOfLikes,
					numberOfReads,
					_id,
					avatar,
					name,
					creatTime,
					authorId,
				}
				//这里是给搜索框点击的事件处理的，方便存储搜素记录，一级一级网上传
				this.$emit("saveSearchHistory");
				// 添加到历史记录列表中去
				uni.navigateTo({
					url: `/pages/articleDetails/articleDetails?params=${JSON.stringify(params)}`
				});
			},


		}
	}
</script>

<style lang="scss" scoped>
	* {
		font-size: 10px;
	}

	@import 'css/index.scss';
</style>
