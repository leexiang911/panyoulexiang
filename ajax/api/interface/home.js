import ajax from '../../http.js'; // 导入ajax

// 获取导航栏的列表
export const get_Lable_Type_List = data => ajax({
	name: "get_Lable_Type_List",
	data,
});

// 没用的测试数据
// export const get_label_list = data => ajax({
// 	name: "get_label_list",
// 	data
// });

// 从文章数据里面获取一个列表
export const get_list_of_articles = data => ajax({
	name: "get_list_of_articles",
	data,
});


