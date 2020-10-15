const state={
    list:[]
}
const mutations={
    changeList(state,arr){
        state.list=arr;
    }
}
import {reqMenuList} from '../../utils/request'
const actions={
    actionFun(context){
        reqMenuList().then(res=>{
            context.commit('changeList',res.data.list);
        })
    }
}
const getters={
    list(state){
        return state.list;
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}