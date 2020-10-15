import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 注意老师此处是用了导出的，如有问题请来此处查看一下
export let chi=[
  {
    path:'banner',
    component:()=>import('../pages/banner/banner'),
    name:'轮播图管理'
  },
  {
    path:'cate',
    component:()=>import('../pages/cate/cate'),
    name:'商品分类'
  },
  {
    path:'goods',
    component:()=>import('../pages/goods/goods'),
    name:'商品管理'
  },
  {
    path:'manage',
    component:()=>import('../pages/manage/manage'),
    name:'管理员管理'
  },
  {
    path:'menu',
    component:()=>import('../pages/menu/menu'),
    name:'菜单管理'
  },
  {
    path:'role',
    component:()=>import('../pages/role/role'),
    name:'角色管理'
  },
  {
    path:'seckill',
    component:()=>import('../pages/seckill/seckill'),
    name:'秒杀活动'
  },
  {
    path:'specs',
    component:()=>import('../pages/specs/specs'),
    name:'商品规格'
  },
  {
    path:'member',
    component:()=>import('../pages/member/member'),
    name:'会员管理'
  }
];

export default new Router({
  routes: [
    {
      path:'/login',
      component:()=>import('../pages/login.vue'),
    },
    {
      path:'/',
      component:()=>import('../pages/index.vue'),
      children:[  
        {
          path:'',
          component:()=>import('../pages/home/home')
        },
        ...chi
      ]
    },
  ]
})
