import Vue from 'vue'
import delBtn from './delBtn'

let obj={
    delBtn
}

for(let k in obj){
    Vue.component(k,obj[k]);
}