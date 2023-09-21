// 这个模块主要获取的是Sku模块的数据的模块

// 引入axios（axios进行了二次封装）
import request from '@/utils/request';

// 获取sku列表数据的接口
// 请求地址：/admin/product/list/{page}/{limit}    请求类型：GET    是否带参：带参
export const reqSkuList = (page,limit) => request({    
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get',
})

// 上架的接口
// 请求地址：/admin/product/list/{page}/{limit}    请求类型：GET    是否带参：带参
export const reqOnSale= (skuId) => request({    
    url: `/admin/product/onSale/${skuId}`,
    method: 'get',
})

// 下架的接口
// 请求地址：/admin/product/list/{page}/{limit}    请求类型：GET    是否带参：带参
export const reqCancelSale= (skuId) => request({    
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get',
})

// SKU查看详情的接口
// 请求地址：/admin/product/getSkuById/{skuId}    请求类型：GET    是否带参：带参
export const reqSkuById= (skuId) => request({    
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get',
})






