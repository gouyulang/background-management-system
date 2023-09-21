// 这个模块主要获取的是品牌管理的数据的模块

// 引入axios（axios进行了二次封装）
import request from '@/utils/request';

// 获取品牌列表接口
// 请求地址：/admin/product/baseTrademark/{page}/{limit}    请求类型：GET    是否带参：带参
export const reqTradeMarkList = (page, limit) => request({     //page代表当前页码，limit代表每页数量
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get',
})

// 新增品牌接口
// 请求地址：/admin/product/baseTrademark/save   请求类型：POST   是否带参：带参（品牌名称，品牌logo）
// 切记：对于新增的品牌，给服务器传递数据，不需要传递ID，ID由服务器生成。
// +
// 修改品牌接口
// 请求地址：/admin/product/baseTrademark/update   请求类型：PUT    是否带参：带参（品牌id，品牌名称，品牌logo）
// 切记：对于修改品牌，给服务器传递数据，需要传递ID，我们需要告诉服务器修改的是哪一个品牌。
// 因为二者传递的参数很类似，我们这里封装一个接口，来实现两个请求。（学到了！！！）
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 带给服务器的数据带有id，则是修改品牌，否则就是新增品牌。
    if (tradeMark.id) {     //修改品牌
        return request({
            url: '/admin/product/baseTrademark/update',
            method: 'put',
            data:tradeMark
        })
    }else {               //新增品牌
        return request({
            url: '/admin/product/baseTrademark/save',
            method: 'post',
            data:tradeMark
        })
    }
}

// 删除品牌接口
// 请求地址：/admin/product/baseTrademark/remove/{id}   请求类型：DELETE    是否带参：带参
export const reqDeleteTradeMark = (id) => request({     //page代表当前页码，limit代表每页数量
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete',
})