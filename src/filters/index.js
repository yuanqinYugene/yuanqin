import Vue from 'vue'
import filterPrice from './filterPrice'
let obj={
    filterPrice
}

for(let k in obj){
    Vue.filter(k,obj[k]);
}