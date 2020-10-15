import Vue from 'vue'

let obj={

}

for(let k in obj){
    Vue.filter(k,obj[k]);
}