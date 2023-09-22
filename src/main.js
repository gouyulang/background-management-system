import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// if (process.env.NODE_ENV === 'development') {   //错的
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

// process是webpack提供的变量。里面包含了一些我们当前的编译环境数据。
// console.log(process.env);

// 引入相关api接口，暴露到全局中
import API from '@/api/index';
// 组件实例的原型的原型指向的是Vue.prototype，任意组件可以使用API相关的接口。
Vue.prototype.$API=API;

// 引入CategorySelect三级联动组件并注册为全局组件
import CategorySelect from '@/components/CategorySelect/index';
// Vue.component() 第一个参数：全局组件的名字，第二个参数：哪一个组件
Vue.component(CategorySelect.name,CategorySelect);

// 引入HintButton按钮提示组件并注册为全局组件
import HintButton from '@/components/HintButton/index';
// Vue.component() 第一个参数：全局组件的名字，第二个参数：哪一个组件
Vue.component(HintButton.name,HintButton);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
