// 这个模块主要获取的是Spu管理的数据的模块

// 引入axios（axios进行了二次封装）
import request from '@/utils/request';

// 获取Spu列表数据接口
// 请求地址：/admin/product/{page}/{limit}    请求类型：GET    是否带参：带参
export const reqSpuList = (page,limit,category3Id) => request({    
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params:{
        category3Id,
    }
})

// 获取某个Spu信息的接口
// 请求地址：/admin/product/getSpuById/{spuId}    请求类型：GET    是否带参：带参
export const reqOneSpu = (spuId) => request({    
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get',
})

// 获取品牌的信息的接口
// 请求地址：/admin/product/baseTrademark/getTrademarkList    请求类型：GET    是否带参：不带参
export const reqTradeMarkList = () => request({    
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get',
})

// 获取Spu图片的接口
// 请求地址：/admin/product/spuImageList/{spuId}     请求类型：GET    是否带参：带参
export const reqSpuImageList = (spuId) => request({    
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get',
})

// 获取品牌全部的销售属性的接口---一共3个销售属性
// 请求地址：/admin/product/baseSaleAttrList     请求类型：GET    是否带参：不带参
export const reqSaleAttrList = () => request({    
    url: '/admin/product/baseSaleAttrList',
    method: 'get',
})

// 修改Spu或者添加Spu的接口
// 因为二者传递的参数很类似，我们这里封装一个接口，来实现两个请求。
// 修改Spu接口请求地址：/admin/product/updateSpuInfo     请求类型： POST    是否带参：带参
// 添加Spu接口请求地址：/admin/product/saveSpuInfo    请求类型： POST    是否带参：带参
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 带给服务器的数据带有id，则是修改Spu，否则就是添加Spu。
    if (spuInfo.id) {     //修改Spu
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data:spuInfo
        })
    }else {               //添加Spu
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data:spuInfo
        })
    }
}

// 删除某个Spu信息的接口
// 请求地址：/admin/product/deleteSpu/{spuId}    请求类型：DELETE     是否带参：带参
export const reqDeleteSpu = (spuId) => request({    
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete',
})

// 获取Spu图片数据接口-------上面已写过
// 请求地址：/admin/product/spuImageList/{spuId}    请求类型：GET    是否带参：带参
// export const reqSpuImageList = (spuId) => request({    
//     url: `/admin/product/spuImageList/${spuId}`,
//     method: 'get',
// })

// 获取Spu销售属性列表数据接口
// 请求地址：/admin/product/spuSaleAttrList/{spuId}    请求类型：GET    是否带参：带参
export const reqSpuSaleAttrList = (spuId) => request({    
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get',
})

// 获取Spu属性列表数据接口
// 请求地址：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}    请求类型：GET    是否带参：带参
export const reqSpuAttrList = (category1Id,category2Id,category3Id) => request({    
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get',
})

// 保存skuForm--添加sku信息的接口
// 请求地址：/admin/product/saveSkuInfo    请求类型：POST    是否带参：带参
export const reqAddSku = (skuInfo) => request({    
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data:skuInfo,
})

// 获取Sku列表数据的接口
// 请求地址：/admin/product/findBySpuId/{spuId}    请求类型：GET   是否带参：带参
export const reqSkuList = (spuId) => request({    
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get',
})


 


