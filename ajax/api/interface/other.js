import ajax from '../../http.js'; // 导入ajax

// 返回搜索到的值
export const get_search_values = data => ajax({
	name: "gets_the_value_to_the_search",
	data,
})

// 获取文章的详情
export const get_article_details = data => ajax({
	name: "get_article_details",
	data,
});

// 更新文章的评论
export const update_comments = data => ajax({
	name: "update_comments",
	data,
});

// 获取文章的评论列表
export const get_list_of_comments = data => ajax({
	name: "get_list_of_comments",
	data,
})
