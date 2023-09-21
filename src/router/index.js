// 引入vue,vue-router
import Vue from 'vue';
import Router from 'vue-router';

// 使用路由插件
Vue.use(Router);

/* 引入最外层结构的一级路由组件*/
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 注意：有个隐藏的布局：我们将路由赋复制在哪里，权限管理组件和其他两个模块的队友位置是相关的。
// 也就是说如果我们将权限路由复制到首页的路由前面，在页面中我们就会看到权限管理模块的位置在首页模块的上面。
// 路由的配置
// 问题：到目前为止，为什么不同用户登陆我们项目，菜单（路由）都是一样的？
// 答：因为目前的路由是死的，不管你是谁，您看见的，你操作的都是一样的。

// 我们在获取到菜单权限数据routes后，需要把项目中的路由进行拆分（常量路由，异步路由，任意路由）。
// 常量路由：就是不关用户是什么角色，都可以看见的路由
//什么角色（超级管理员，普通员工）：登录、404、首页
export const constantRoutes = [
  // 首页相关
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    // 路由重定向
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]

//异步路由:不同的用户（角色），需要过滤筛选出的路由，称之为异步路由
//有的用户可以看见测试管理、有的看不见
export const asyncRoutes = [
  // 权限相关的路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  // 商品管理相关
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    // icon是选择图标
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [{
      path: 'trademark',
      name: 'tradeMark',
      component: () => import('@/views/product/tradeMark/index'),
      meta: { title: '品牌管理' }
    },
    {
      path: 'attr',
      name: 'Attr',
      component: () => import('@/views/product/Attr/index'),
      meta: { title: '品牌属性管理' }
    },
    {
      path: 'spu',
      name: 'Spu',
      component: () => import('@/views/product/Spu/index'),
      meta: { title: 'Spu管理' }
    },
    {
      path: 'sku',
      name: 'Sku',
      component: () => import('@/views/product/Sku/index'),
      meta: { title: 'Sku管理' }
    }]
  },
  // 测试管理相关
  {
    path: '/test',
    component: Layout,
    name: 'Test',
    // icon是选择图标
    meta: { title: '测试管理', icon: 'el-icon-goods' },
    children: [{
      path: 'test1',
      name: 'Test1',
      component: () => import('@/views/Test/Test1'),
      meta: { title: '测试管理1' }
    },
    {
      path: 'test2',
      name: 'Test2',
      component: () => import('@/views/Test/Test2'),
      meta: { title: '测试管理2' }
    }]
  },
]

//任意路由：当路径出现错误的时候重定向404
export const anyRoutes = {
  path: '*',
  redirect: '/404',
  hidden: true
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 滚动条
  scrollBehavior: () => ({ y: 0 }),
  // 我们注册的路由是死路由，‘活的’路由如果根据不同用户（角色）可以展示不同菜单
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
