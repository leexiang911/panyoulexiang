export default {
	install(Vue) {
		Vue.mixin({
			data() {
				return {
					ChinPhoneNumberReg: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
					EmailReg: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
					userRules: {
						// 用户名
						loginName: {
							rules: [{
								required: true,
								"errorMessage": "账户名不能为空"
							}, {
								validateFunction: this.validateLoginName
							}]
						},
						// 密码
						loginPassword: {
							rules: [{
								required: true,
								"errorMessage": "密码不能为空"
							}, {
								validateFunction: this.validatePassword
							}]
						},
						// 电话号码
						phoneNumber: {
							rules: [{
									required: true,
									'errorMessage': "手机号码不能为空"
								},
								{
									validateFunction: this.validatePhone
								}
							]
						},
						// 验证码
						captchaCode: {
							rules: [{
								required: true,
								'errorMessage': "请输入6位验证码"
							}, {
								validateFunction: this.validatecaptchaCode
							}]
						},
						// 邮件地址
						emailAddress: {
							rules: [{
								required: true,
								'errorMessage': "请输入邮箱地址"
							}, {
								validateFunction: this.validateEmailAddress
							}]
						},
						//用户名
						nickname: {
							rules: [{
								required: true,
								'errorMessage': "请输入昵称"
							}, {
								validateFunction: this.validateNickname
							}]
						},
						// 注册密码
						registrationPassword: {
							rules: [{
								required: true,
								'errorMessage': "请输入您的密码"
							}, {
								validateFunction: this.validateRegistrationPassword
							}]
						},
						// 确认密码
						confirmPassword: {
							rules: [{
								required: true,
								'errorMessage': "请再次确认密码",
								// trigger: 'blur'
							}, {
								validateFunction: this.validateConfirmPassword
							}]
						}

					}
				}
			},
			methods: {
				// 验证登录的账号
				validateLoginName(rule, val, data, callback) {
					switch (true) {
						case val.length < 3:
							callback('用户名长度不正确');
							break
						default:
							return true;
					}
				},
				validatePhone(rule, val, data, callback) {
					switch (true) {
						case !this.ChinPhoneNumberReg.test(val):
							callback('手机号码不正确')
							break;
						default:
							break;
					}
				},
				validatePassword(rule, val, data, callback) {
					switch (true) {
						case val.length < 10:
							callback('密码至少10位数');
							break;
						default:
							return true;
					}
				},
				validatecaptchaCode(rule, val, data, callback) {
					switch (true) {
						case val !== this.returnCode:
							callback('验证码不正确');
							break;
						default:
							return true;
					}
				},
				validateEmailAddress(rule, val, data, callback) {
					switch (true) {
						case !this.EmailReg.test(val):
							callback('请检查邮箱地址是否有误');
							break;
						default:
							break;
					}
				},
				validateNickname(rule, val, data, callback) {
					switch (true) {
						case val.length < 3:
							callback("昵称不足3位");
							break;
						default:
							return true;
							break;
					}
				},
				validateRegistrationPassword(rule, val, data, callback) {
						if(val.length<10){
							callback("密码必须要十位")
						}
				},
				validateConfirmPassword(rule, val, data, callback) {
					if (this.formData.registrationPassword) {
						if (val !== this.formData.registrationPassword) {
							callback("两次密码不一致")
						}
					}
				}
			}
		});
	}
}
