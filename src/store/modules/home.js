import mockRequest from '../../utils/mockRequest';

const state = {
    list:{},
}

const mutations = {
    GETDATA(state,data){
        state.list=data;
    }
}

const actions = {
    // 发请求获取首页的mock数据
    async getData(context) {
        const result = await mockRequest.get('/home/list');
        // console.log(result);
        if (result.code === 20000) {
            context.commit('GETDATA', result.data);
        }
    }
}
const getters = {
}

export default {
    state,
    mutations,
    actions,
    getters
}
