import {
	mapState,
	mapMutations
} from 'vuex'

export default {
	install(Vue) {
		Vue.mixin({
			data() {
				return {}
			},
			methods: {
				checkedisLogin() {
					//获取用户信息
					return new Promise(resolve => {
						if (this.USERINFO) {
							console.log(this.USERINFO,"这是Mixin文件")
							resolve();
						} else {
							uni.navigateTo({
								url: '/pages/userInfo/userLogin/userLogin'
							})
						}
					});
				},
				...mapMutations(['updateUserInfo']),
			},
			computed: {
				...mapState(['USERINFO'])
			}
		})
	}
}
