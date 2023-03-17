import ajax from '../../http.js'; // 导入ajax

// 获取签到的时间来判断是否签到成功
export const getAttendanceTime = data => ajax({
	name: "getAttendanceTime",
	data
});

// 用户登录
export const user_login_username_pwd = data => ajax({
	name: 'user_login_UserName_Password',
	data
});

// 通过手机验证码登录，此函数用于获取验证码
export const get_verification_code = data => ajax({
	name: 'get_verification_code',
	data
});


// 手机号码登录，已经获取了验证码
export const user_login_with_phoneNumber = data => ajax({
	name: "user_login_with_phoneNumber",
	data
});

// 用户注册时候的系统头像
export const get_list_of_avatars = data => ajax({
	name: "get_list_of_avatars",
	data
});

// 用户签到函数，向用户的签到数据中添加最新的签到时间
export const add_checkin_time = data => ajax({
	name: 'add_checkin_time',
	data
});

// 更新用户选择的标签列表，（就是选项卡的标签）
export const update_the_users_label = data => ajax({
	name: "update_the_users_label",
	data
});

// 用户发布文章
export const publish_an_article = data => ajax({
	name: "publish_an_article",
	data
});

// 修改关注，保存文章的作者状态
export const update_follow_authors = data => ajax({
	name: "update_follow_authors",
	data
});


// 新增一个用户，用户注册
export const add_a_new_user = data => ajax({
	name: "add_a_new_user",
	data
});

// 跟新点爱心文章的信息
export const update_like_articles = data => ajax({
	name: "update_like_articles",
	data
})

// 更新文章点赞
export const update_thumb_up_article = data => ajax({
	name: "update_thumb_up_article",
	data
});

// 获取用户关注的用户列表
export const get_follow_authors = data => ajax({
	name: "get_follow_authors",
	data
});

// 获取用户点赞过的文章
export const get_thumbup_articles = data => ajax({
	name: "get_thumbup_articles",
	data
});

// 寻找该作者的发布的文章
export const get_author_articles = data => ajax({
	name: "get_author_articles",
	data
});

// 获取用户收藏过的文章
export const get_favorites_article_list = data => ajax({
	name: "get_favorites_article_list",
	data
})

// 根据id获取我的账户
export const get_user_account = data => ajax({
	name: "get_user_account",
	data
});

// 更新我的账户
export const update_my_account = data => ajax({
	name: "update_my_account",
	data
})
