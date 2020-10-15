import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'//引入整个状态层
import { state } from '../store/mutations';

Vue.use(Router)

// 路由独享守卫（核对用户是否有访问这个路由页面的权限）
function checkedEnter(path,next){
  let menus_url=store.state.userInfo.menus_url;
  // 如果有权限访问，直接next
  if(menus_url.includes(path)){
    next();
  }else{
    // 如果要去的页面在自己的用户信息中并没有这个权限，那么就去首页
    next("/")
  }
}

// 注意老师此处是用了导出的，如有问题请来此处查看一下
export let chi = [
  {
    path: 'banner',
    component: () => import('../pages/banner/banner'),
    name: '轮播图管理',
    beforeEnter(to,from,next){
      checkedEnter('/banner',next);//注意此处的参数虽是二级路由，但也要带上/，因为后端传回的数据的menus_url数组中的路径都是携带/的，如果想通过includes方法匹配就需要和数组保持一致
    }
  },
  {
    path: 'cate',
    component: () => import('../pages/cate/cate'),
    name: '商品分类',
    beforeEnter(to,from,next){
      checkedEnter('/cate',next);
    }
  },
  {
    path: 'goods',
    component: () => import('../pages/goods/goods'),
    name: '商品管理',
    beforeEnter(to,from,next){
      checkedEnter('/goods',next);
    }
  },
  {
    path: 'manage',
    component: () => import('../pages/manage/manage'),
    name: '管理员管理',
    beforeEnter(to,from,next){
      checkedEnter('/manage',next);
    }
  },
  {
    path: 'menu',
    component: () => import('../pages/menu/menu'),
    name: '菜单管理',
    beforeEnter(to,from,next){
      checkedEnter('/menu',next);
    }
  },
  {
    path: 'role',
    component: () => import('../pages/role/role'),
    name: '角色管理',
    beforeEnter(to,from,next){
      checkedEnter('/role',next);
    }
  },
  {
    path: 'seckill',
    component: () => import('../pages/seckill/seckill'),
    name: '秒杀活动',
    beforeEnter(to,from,next){
      checkedEnter('/seckill',next);
    }
  },
  {
    path: 'specs',
    component: () => import('../pages/specs/specs'),
    name: '商品规格',
    beforeEnter(to,from,next){
      checkedEnter('/specs',next);
    }
  },
  {
    path: 'member',
    component: () => import('../pages/member/member'),
    name: '会员管理',
    beforeEnter(to,from,next){
      checkedEnter('/member',next);
    }
  }
];

let router = new Router({
  routes: [
    {
      path: '/login',
      component: () => import('../pages/login.vue'),
    },
    {
      path: '/',
      component: () => import('../pages/index.vue'),
      children: [
        {
          path: '',
          component: () => import('../pages/home/home')
        },
        ...chi
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  // 如果去登录，直接next
  if (to.path == "/login") {
    next();
    return;
  }
  // 如果不是去登录，查看是否有登录信息，有就next没有就去登录
  if (store.state.userInfo.token) {
    next();
    return;
  }
  next("/login");
})
export default router;