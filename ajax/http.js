export default ({ name, data = {} }) => {
    // 核心是返回一个promise对象
    return new Promise((resolve, reject) => {
        const loading = data.isLoading;
        data.isLoading && delete data.isLoading; // 避免传入脏值给后端
        !loading && uni.showLoading({ // 1️⃣ 打开loading弹窗
            title: '加载中'
        });

        // 2️⃣ uniCloud的函数调用，正真的发起数据的请求
        uniCloud.callFunction({
            name, //name 是云函数的名字
            data,
            success({ // 成功的状态
                result
            }) {
                if (result.code === 0) { //表示请求成功，真正的可以拿到数据值
                    resolve(result.data);
                } else {

                    uni.showToast({ // 提示框，表示后端没有查询到数据值
                        icon: "none",
                        title: result.msg
                    });
                }
            },
            fail(err) { // 这里才是请求失败，一般是网络的原因或者是后端的错误
                reject(err);
            },
            complete() { // 完成的状态
                !loading && uni.hideLoading(); // 关闭弹窗（loading弹窗）
            }
        })
    })
}
