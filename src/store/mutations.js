
// 问：有了sessionStorage为啥还要弄userInfo?
// 答：用状态层数据取或者改的时候很方便，如果用session每次都要判断是否有这个数据然后再取，比较麻烦。
export const state={
    userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export const mutations={
    changeUserInfo(state,info){
        state.userInfo=info;
        if(info.id){
            sessionStorage.setItem("userInfo",JSON.stringify(info))
        }else{
            // 点击退出，清除信息
            sessionStorage.removeItem("userInfo")
        }
    }
}
export const getters={
    userInfo(state){
        return state.userInfo;
    }
}
