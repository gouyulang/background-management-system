// 引入axios（axios进行了二次封装）
import request from '@/utils/request';

// 登陆接口
// 接口地址：/admin/acl/index/login    请求类型：POST    是否带参：带参
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

// 获取用户信息的接口
// 接口地址：/admin/acl/index/info   请求类型：GET   是否带参：带参
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

// 退出登陆的接口
// 接口地址：/admin/acl/index/logout     请求类型：POST   是否带参：不带参
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
