// 引入登陆，退出登陆，获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user';
// 引入获取token，存储token，删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth';
// 引入路由模块当中重置路由，异步路由，常量路由，任意路由
import { resetRouter,asyncRoutes,constantRoutes,anyRoutes } from '@/router';
// 引入路由器
import router from '@/router';

// 箭头函数
const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 存储菜单权限标记
    routes:[],
    // 按钮权限标记
    buttons:[],
    // 存储角色
    roles:[],
    // 对比之后：项目中已有的异步路由，与服务器返回的标记路由信息进行对比最终需要展示的路由。
    resultAsyncRoutes:[],
    // 存储最终需要展示的全部路由
    resultAllRoutes:[],
  }
}
const state = getDefaultState()

// 唯一修改state的地方
const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // 存储用户名
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // 存储用户头像
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  // 存储用户信息
  SET_USERINFO:(state, userInfo) => {
    //存储用户名
    state.name = userInfo.name;    
    //存储用户头像
    state.avatar=userInfo.avatar;   
    // 存储菜单权限标记
    state.routes=userInfo.routes;
    // 按钮权限标记
    state.buttons=userInfo.buttons;
    // 存储角色
    state.roles=userInfo.roles;
  },
  // 计算最终的异步路由
  SET_RESULTASYNCROUTES:(state, asyncRoutes)=>{
    // vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes=asyncRoutes;
    // 计算出当前用户需要展示所有路由
    state.resultAllRoutes=constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
    // 给路由器router添加新的路由
    router.addRoutes(state.resultAllRoutes);
  }
}

// 定义一个函数computedAsyncRoutes()，是对比当前用户要显示那些路由。
const computedAsyncRoutes=(asyncRoutes,routes)=>{
  // console.log(asyncRoutes,routes);
  // 过滤出当前用户（超级管理员，普通员工）需要展示的异步路由
  return asyncRoutes.filter(item=>{
    // console.log(item);
    // 数组中没有这个元素返回-1，有则非-1   （注意是indexOf()，而不是index()----深痛的教训！）
    if(routes.indexOf(item.name)!=-1){
      // 递归 （可能有二级，三级...路由）
      if(item.children&&item.children.length){
        item.children=computedAsyncRoutes(item.children,routes);
      }
      return true;
    }
  })
}

// actions
const actions = {
  // 处理登陆业务
  async login({ commit }, userInfo) {
    // 解构用户名和密码
    const { username, password } = userInfo;
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response;
    //     commit('SET_TOKEN', data.token);
    //     setToken(data.token);
    //     resolve();
    //   }).catch(error => {
    //     reject(error);
    //   })
    // })

    // 使用async和await改写
    let result = await login({ username: username.trim(), password: password });
    // console.log(result);      //返回的data内存储着一个token字符串
    // 注意：当前登录请求使用的是mock数据，它的code是20000
    // code=20000代表成功
    if (result.code == 20000) {
      // 存储token
      commit('SET_TOKEN',result.data.token);
      // 在本地持久化存储token：将token存储在cookie中
      setToken(result.data.token);
      return 'ok';
    } else {
      return Promise.reject(new Error('Failure'));
    }
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 获取用户信息
      getInfo(state.token).then(response => {
        // 返回的response就是用户信息,包含用户名name,用户头像acatar，roles用户角色信息，button按钮的信息（用来做按钮权限的），路由routes（返回的标志：不同的用户应该展示哪些菜单的标记）
        // console.log(response);
        // 解构data    
        const { data } = response;
        // 判断用户信息不能为空
        if (!data) {
          return reject('Verification failed, please Login again.');
        }
        // 解构参数（用户名，用户头像）
        // const { name, avatar } = data;
        // commit('SET_NAME', name);
        // commit('SET_AVATAR', avatar);
        // 存储用户的全部的信息
        commit('SET_USERINFO',data);
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes));
        resolve(data);
      }).catch(error => {
        reject(error);
      })
    })
  },

  // 退出登陆
  async logout({ commit, state }) {

    // 使用async和await改写
    let result = await logout(state.token)
    // console.log(result);
    // 注意：当前登录请求使用的是mock数据，它的code是20000
    // code=20000代表成功
    if (result.code == 20000) {
      removeToken(); // must remove  token  first
      resetRouter();
      commit('RESET_STATE');
      return 'ok';
    } else {
      return Promise.reject(new Error('Failure'));
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

