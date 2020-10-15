import { reqSpecsList, reqSpecsCount } from '../../utils/request'
const state = {
    list: [],
    total: 0,
    size: 2,
    page: 1
}
const mutations = {
    changeList(state, arr) {
        state.list = arr;
    },
    changeTotal(state, num) {
        state.total = num;
    },
    changePage(state, page) {
        state.page = page;
    }
}
const actions = {
    reqListAction(context,bool) {
        // 如果获取列表没有传参数（page size）,那么会取到所有的规格
        let params = bool?{}:{ size: context.state.size, page: context.state.page };
        reqSpecsList(params).then(res => {
            let list = res.data.list ? res.data.list : [];
            if (context.state.page > 1 && list.length == 0) {
                context.commit("changePage", context.state.page - 1);
                context.dispatch("reqListAction");
                return;
            }
            // 后台数据中的attrs规格属性是以"[]"这样的形式存储和返回的，所以在获取到后台返回的list之后，就要将其里面的attrs属性值转换一下，不然在页面中使用到list时会不对劲
            list.forEach(item => {
                item.attrs = JSON.parse(item.attrs);
            });

            context.commit('changeList', list);
        });
    },
    reqTotalAction(context) {
        reqSpecsCount().then(res => {
            context.commit("changeTotal", res.data.list[0].total);
        })
    },
    changePageAction(context, page) {
        context.commit("changePage",page);
        context.dispatch("reqListAction")
    }
}
const getters = {
    list(state) {
        return state.list;
    },
    total(state) {
        return state.total;
    },
    size(state) {
        return state.size;
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}