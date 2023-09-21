// 这个模块主要获取的是品牌属性管理的数据的模块

// 引入axios（axios进行了二次封装）
import request from '@/utils/request';

// 获取三级联动的一级分类数据接口
// 请求地址：/admin/product/getCategory1    请求类型：GET    是否带参：不带参
export const reqCategory1List = () => request({    
    url: '/admin/product/getCategory1',
    method: 'get',
})

// 获取三级联动的二级分类数据接口
// 请求地址：/admin/product/getCategory2/{category1Id}    请求类型：GET  是否带参：带参
export const reqCategory2List = (category1Id) => request({    
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get',
})

// 获取三级联动的三级分类数据接口
// 请求地址：/admin/product/getCategory2/{category1Id}    请求类型：GET  是否带参：带参
export const reqCategory3List = (category2Id) => request({    
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get',
})

// 获取品牌属性的接口
// 请求地址：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}    请求类型：GET  是否带参：带参
export const reqAttrList = (category1Id,category2Id,category3Id) => request({    
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get',
})

// 添加与修改属性与属性值的接口
// 请求地址：/admin/product/saveAttrInfo    请求类型：POST  是否带参：带参
export const reqAddOrUpdateAttr = (data) => request({    
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data,
})
/* data需要的数据格式：
{
    "attrName": "string",     属性名
    "attrValueList": [        属性值列表-数组格式
        {
            "attrId": 0,     
            "valueName": "string"
        }
    ],
    "categoryId": 0,        属性id
    "categoryLevel": 3,     属性级别（默认就是三级分类）
} 
*/



