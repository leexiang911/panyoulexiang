<template>
	<view class="publish-container">
		<!-- 顶部栏 -->
		<view class="paddingTop" :style="{height:topPadding + 'px',widht:'100vw'}">
			<text class="topTitle">帖子发布</text>
		</view>
		<view class="scrollContainer" :style="{height: `calc(100% - ${topPadding}px)`}">
			<scroll-view scroll-y="true" style="overflow: hidden;" class="scrollY">

				<!-- 这里面开始就是内容了 -->
				<view class="previewOptions">
					<!-- 这里是选择在主页显示什么样式，是纯文本还是图文，还是大图，多图模式 -->
					<text class="previewOptions-title" style="margin-left: 1rem;color: #666;">选择主页预览样式</text>
					<view class="select_type_img">
						<!-- 纯文本 -->
						<image @click="imgType=0" :class="{active:imgType===0}" src="../../static/publishPage/text.svg"
							mode="aspectFill">
						</image>
						<!-- 图文 -->
						<image @click="imgType=1" :class="{active:imgType===1}"
							src="../../static/publishPage/text-img.svg" mode="aspectFill"></image>
						<!-- 大图 -->
						<image @click="imgType=2" :class="{active:imgType===2}"
							src="../../static/publishPage/bagImg.svg" mode="aspectFill"></image>
						<!-- 多图 -->
						<image @click="imgType=3" :class="{active:imgType===3}"
							src="../../static/publishPage/columnsImage.svg" mode="aspectFill"></image>
					</view>
				</view>

				<!-- 上传图片区域 -->
				<view v-if="imgType!=0" class="updateImg">
					<text class="title">图片上传</text>
					<view class="updateImgContainer">
						<!-- 图文和大图模式 -->
						<view @click="updateTextAndImgHandle" v-if="imgType===1 || imgType===2" class="imageConteiner">
							<image :src="imgUrl" mode="aspectFill"></image>
							<view v-if="imgUrl" @click.stop="this.imgUrl=''" class="closeIcon">
							</view>
						</view>
						<!-- 多图模式，最多给用户传入4张 -->
						<view v-if="imgType===3 && index <=4 " v-for="(item , index) in previewTheImageList"
							:key="index" class="">
							<view class="imageConteiner">
								<image :src="item" mode="aspectFill"></image>
								<view v-if="item" @click.stop="removeMoreImgHandle(index)" class="closeIcon">
								</view>
							</view>
						</view>
						<!-- 这里的背景只能做上传作用，0到3张就一共4张就不显示了 -->
						<view @click="updateMoreImgHandle" v-if="imgType===3 && previewTheImageList.length<=3"
							class="imageConteiner">
						</view>
					</view>
				</view>
				<!-- 文章类型 -->
				<view class="selectArticleType">
					<text style="display: block;margin-left: 1rem;margin-bottom: 0.5rem; color: #666;">请选择分类</text>
					<uni-data-select placeholder="请选择帖子分类" :clear="false" v-model="value" :localdata="range"
						@change="change">
					</uni-data-select>
				</view>

				<!-- 标题 -->
				<view class="articleTitleContainer">
					<text class="title"> 帖子标题</text>
					<textarea class="inputTitle" maxlength="40" placeholder="请输入标题" v-model="articletitle"></textarea>
					<view class="number">
						{{articletitle.length}}/40
					</view>
				</view>
				<!-- 摘要 -->
				<view class="abstractTextContainer">
					<text class="title">内容摘要</text>
					<textarea v-model="abstractText" maxlength="100" placeholder="请输入内容摘要,它将会在主页列表中展示"
						class="inputAbstractText" rows="10"></textarea>
					<view class="number">
						{{abstractText.length}}/100
					</view>
				</view>

				<!-- 正文输入 -->
				<view class="articleBodyContainer">
					<text class="title">帖子正文</text>
					<view style="overflow: hidden;" class="articlebody">
						<robin-editor class="editor" @cancel="hideEditor" @save="saveEditor" v-model="textBodyhtml"
							:imageUploader="uploadImg" :muiltImage="true">
						</robin-editor>
					</view>
				</view>

				<view class="bottom_btnContainer">
					<button @click="submiArticleHandle" size="mini" type="default">发布</button>
				</view>
				<!-- 这里解决了scroll的问题,保险起见在加一个空view来填充 -->
				<view class="paddingBottom" style="height: 6rem;width: 100%;"></view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import {
		mapState,

	} from 'vuex'
	export default {
		components: {
			// Editor

		},
		data() {
			return {
				topPadding: 20, // 高度默认给20
				imgType: 0, // 图片类型默认是第一种类，用0来
				typography: ["text", "text-img", "bigImg", "columnsImage"], // 分别是纯文本，图文，大图，多图
				value: 0, // 下拉框的值
				range: [],
				articletitle: "", // 文章标题
				previewTheImageList: [], //预览图列表
				imgUrl: "",
				textBodyhtml: '',
				abstractText: '', // 摘要
				articeType: null
			}
		},
		methods: {
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				systemInfo.statusBarHeight && (this.statusHeight = systemInfo.statusBarHeight * 2);
				// #ifdef MP-WEIXIN
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				this.topPadding = menuButtonInfo.top + menuButtonInfo.height; //按钮举例顶部和按钮的高度
				// this.NavbarContentHeight = menuButtonInfo.height; //按钮高度
				// this.NavbarContentWidth = menuButtonInfo.left; //按钮举例左边
				// #endif
			},
			// 下拉框选择改变的函数
			change(e) {

				// 数组是从零开始的，这里需要减去1
				this.articeType = this.range[e - 1].text
			},
			// 大图和图文上传图片的函数
			updateTextAndImgHandle() {
				let This = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					success(res) {
						const uploadTempImgUrl = res.tempFilePaths[0];
						This.imgUrl = uploadTempImgUrl
						const uploadTempImgName = Date.now() + res.tempFilePaths[0].substring(res.tempFilePaths[0]
							.length - 20);
						uni.showToast({
							title: "上传成功",
							icon: "success"
						})
					},
					complete(e) {
						console.log(e)
					}
				})
			},
			// 多图上传的函数，这是伪上传，其实就是选中
			updateMoreImgHandle() {
				let This = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					success(res) {
						const uploadTempImgUrl = res.tempFilePaths[0];
						This.previewTheImageList.push(uploadTempImgUrl)
						This.uploadTempImgName = Date.now() + res.tempFilePaths[0].substring(res.tempFilePaths[0]
							.length - 20);
						uni.showToast({
							title: "上传成功",
							icon: "success"
						})
					},
					complete(e) {
						// console.log(e)
					}
				})
			},
			// 用户点击多图模式下的删除图片
			removeMoreImgHandle(index) {
				// 拿到下面的index，我要求过滤掉我点击的第index个的元素
				this.previewTheImageList = this.previewTheImageList.filter((value, i, arr) => {
					return i != index
				});
			},
			// 正文上传图片
			async uploadImg(imgUrl, callback) {
				// 处理图片名字方便上传图片
				const imgName = Date.now().toString() + imgUrl.substr(imgUrl.lastIndexOf("."));
				await uniCloud.uploadFile({
					filePath: imgUrl,
					cloudPath: imgName,
					success(e) {
						callback(e.fileID);
					},
					onUploadProgress: function(progressEvent) { //返回进度的函数
						/* 	console.log(progressEvent);
							var percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							); */
					},
				});
			},
			hideEditor() { // 文本的取消编辑
				console.log("hideEditor")
			}, // 富文本插件的保存的回调函数
			saveEditor() {

			},
			// 上传多张图片，这是链接列表
			async _updateImgList(imgListArr) {
				const tempImgSrcList = [];
				if (imgListArr.length < 2) {
					return tempImgSrcList; //才两张图片就给我上传,给你返回空数组
				}
				await Promise.all(
					imgListArr.map(
						async (item) => {
							const {
								fileID // 在服务器中的文件地址
							} = await uniCloud.uploadFile({
								filePath: item,
								cloudPath: Date.now().toString() + item.substr(item.lastIndexOf('.'))
							});
							tempImgSrcList.push(fileID);
						}
					));
				console.log('上传没有')
				return tempImgSrcList;
			},
			submiArticleHandle() {
				this.getArticleData()
			},
			// 获取文章数据
			async getArticleData() {
				if (!this.USERINFO.userInfo) {
					uni.showToast({
						title: "你还没登录，不能发布",
						icon: 'none'
					});
					return;
				}

				let articleClassification = this.typography[this
					.imgType]; // 可以是文本（text），可以是（text-img），大图（bigImg），多图（columnsImage）
				let title = this.articletitle; // 文章标题
				let articleType = this.articeType; // 帖子类型，比如动漫，恐怖片，韩剧等等
				let abstractText = this.abstractText; // 内容摘要
				let previewTheImage = this.imgUrl; // 图文，大图的预览图如果不是文本，也不是多图，就必须有
				let textBody = this.textBodyhtml; // 正文
				let previewTheImageList = [...this.previewTheImageList]; // 多图模式预览图的列表
				// 判断
				// 检查标题
				// return;
				if (!title) { // 空标题
					uni.showToast({
						title: "标题不能为空",
						icon: 'error'
					});
					return;
				}
				// 检查分类
				if (!articleType) {
					uni.showToast({
						title: "请选择帖子分类",
						icon: "none"
					});
					return;
				}

				// 检查摘要
				if (!abstractText) {
					uni.showToast({
						title: "请填写文章摘要，随便从正文中复制一段也行",
						icon: "none"
					});
					return;
				}
				// 检查正文
				if (!textBody) {
					uni.showToast({
						title: "发现没有正文，请检查是否保存",
						icon: "none"
					});
					return;
				}
				// 检查图片
				if (articleClassification === "text-img" || articleClassification === "bigImg") { // 大图模式，或者图文模式
					if (!previewTheImage) {
						uni.showToast({
							title: "哥哥如果你不想上传图片，就选纯文本",
							icon: 'none'
						});
						return;
					} else {
						// 你已经有图片了我就清空多图模式的列表
						previewTheImageList = [];
						this.previewTheImageList = [];
					}
				} else if (articleClassification === "columnsImage") { // 多图模式
					if (previewTheImageList.length < 2) {
						uni.showToast({
							title: "多图模式请上传至少2张图片",
							icon: 'none'
						});
						return;
					}

				} else { // 进入纯文本模式
					previewTheImage = '';
					previewTheImageList = [];
				}
				// 上传单张图片
				if (!previewTheImage) {
					previewTheImage = ''
				} else {
					const imgName = Date.now().toString() + previewTheImage.substr(previewTheImage.lastIndexOf("."));
					const result = await uniCloud.uploadFile({
						filePath: previewTheImage,
						cloudPath: imgName,
						onUploadProgress: function(progressEvent) {
							console.log(progressEvent);
							var percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
						}
					});
					previewTheImage = result.fileID;
				}
				// 处理时间上传给服务器
				// 处理时间，方便传入用户
				const dateNow = new Date();
				const Month = `${(dateNow.getMonth() + 1)}`;
				const Todydate = `${dateNow.getDate()}`
				const currentTime =
					`${dateNow.getFullYear()}.${Month.padStart(2,"0")}.${Todydate.padStart(2,"0")} ${dateNow.getHours()}:${dateNow.getMinutes()}`;
				const {
					avatar,
					name,
				} = this.USERINFO.userInfo;

				// 开始向后端请求数据
				console.log("向后端发送数据")

				const imgUrlList = await this._updateImgList(previewTheImageList)
				const res = await this.$http.publish_an_article({
					"title": title, // 文章标题
					"articleType": articleType, // 文章类型
					"abstractText": abstractText, // 文章摘要
					"content": textBody, // 正文
					"previewTheImageList": [...imgUrlList], // 多图模式的图
					"previewTheImage": previewTheImage, // 图文，大图的图片地址
					"articleClassification": articleClassification, // 排版类型
					"author": {
						"name": name,
						"avatar": avatar,
						"creatTime": currentTime,
						"authorId": this.USERINFO._id
					}
				});

				uni.showToast({
					title: '发布成功',
					icon: 'success'
				});
				this.articeType = null;
				this.articletitle = '';
				this.textBodyhtml = '';
				this.abstractText = '';
				this.imgType = 0;
				this.value = 0;
				this.imgUrl = '';
				this.range = [];
				this.previewTheImageList = []

			}
		},
		created() {
			this.getSystemInfo(); //获取设备信息		
			let tempSelectData = []; //
			this.LABEL.forEach((element, index, arr) => {
				tempSelectData.push({
					text: element.name,
					value: index
				})
			});
			tempSelectData.shift();
			this.range = tempSelectData;
		},
		computed: {
			...mapState(["LABEL"])
		},
		onLoad() {
			// 验证用户登录没有，如果没有登录抓紧去登录
			// #ifdef MP-WEIXIN
				if(!this.USERINFO){
					uni.redirectTo({
						url:'/pages/userInfo/userLogin/userLogin'
					})
				}
			// #endif
		}
	}
</script>

<style lang="scss">
	* {
		padding: 0;
		margin: 0;
	}

	page {
		height: 100vh;
		width: 100vw;
		display: flex;
		font-size: 0.8rem;
	}

	.publish-container {
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		@include flex(flex-start, column);
		align-items: inherit;

		// 顶部标签
		.paddingTop {
			position: relative;
			left: 0;
			right: 0;
			background-color: #f8f8f8;
			overflow: hidden;

			.topTitle {
				position: absolute;
				left: 0;
				bottom: 0.5rem;
				text-align: center;
				width: 100%;
				overflow: hidden;
			}
		}

		.scrollContainer {
			flex: 1;
			box-sizing: border-box;
			width: 100vw;
			// background-color: #f40;
			// position: relative;
			overflow: hidden;
		}

		.scrollY {
			position: fixed;
			width: 100%;
			height: inherit;
			left: 0;
			bottom: 0;
			transition: all 0.4s;
			box-sizing: content-box;

			.previewOptions {
				.select_type_img {
					width: 100vw;
					height: 20vw;

					image {
						width: 25%;
						// margin: 0.2rem;
						border: 1px solid #eee;
						box-sizing: border-box;
						height: 100%;

						&.active {
							border: 2px solid #8AB839;
							background-color: #f5f5f5;
						}
					}
				}
			}

			.updateImg {
				.title {
					display: block;
					margin-left: 1rem;
					color: #666;
				}

				.updateImgContainer {
					width: 100vw;
					height: 20vw;
					box-sizing: border-box;
					display: flex;
					justify-content: space-around;

					.imageConteiner {
						width: 20vw;
						height: 20vw;
						box-sizing: border-box;
						border-radius: 0.2rem;
						border: 2px solid #efefef;
						background-image: url('https://lice-1255683938.file.myqcloud.com/uniapp/updateImg.svg');
						position: relative;

						image {
							width: 100%;
							height: 100%;
						}

						.closeIcon {
							width: 1rem;
							height: 1rem;
							background-color: #f40;
							border-radius: 50%;
							top: -0.4rem;
							right: -0.4rem;
							position: absolute;
							background-image: url(https://lice-1255683938.file.myqcloud.com/uniapp/delete_icon.svg);
						}
					}
				}
			}


			.selectArticleType {
				// background-color: #f40;
				width: 100vw;
			}

			.articleTitleContainer {
				padding: 1rem;

				.number {
					color: #999;
				}

				.title {
					color: #666;
				}

				.inputTitle {
					margin-top: 0.5rem;
					background-color: #f8f8f8;
					width: 100%;
					height: 3rem;
					border-radius: 0.1rem;
				}
			}

			.abstractTextContainer {
				padding: 0 1rem;

				.number {
					color: #999;
				}

				.title {
					color: #666;
				}

				.inputAbstractText {
					background-color: #f8f8f8;
					width: 100%;
					height: 4rem;
					border-radius: 0.1rem;
				}
			}

			.articleBodyContainer {
				width: 100%;

				.title {
					display: block;
					margin-left: 1rem;
				}

				.articlebody {
					width: 100vw;
					// height: 100vh;					
				}
			}

			.bottom_btnContainer {
				display: flex;
				margin-top: 1rem;

				button {
					height: 2rem;
					font-size: 1rem;
					line-height: 2rem;
				}
			}
		}


	}
</style>
