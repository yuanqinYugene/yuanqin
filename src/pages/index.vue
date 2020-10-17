<template>
  <div>
    <el-container class="contain">
      <!-- 侧边 -->
      <el-aside width="200px" class="left">
        <!-- 菜单导航 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#20222a"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
        >
          <!-- 一级菜单 -->
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <!-- 动态侧边栏 -->
          <div v-for="item in userInfo.menus" :key="item.id">
            <el-submenu :index="item.id+''" v-if="item.children">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item :index="item.url" v-else>{{item.title}}</el-menu-item>
          </div>
          <!-- 动态侧边栏结束 -->

          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-tools"></i>系统设置
            </template>

            <el-menu-item-group>
              <el-menu-item index="menu">菜单管理</el-menu-item>
              <el-menu-item index="role">角色管理</el-menu-item>
              <el-menu-item index="/manage">管理员管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-platform"></i>商城管理
            </template>

            <el-menu-item-group>
              <el-menu-item index="cate">商品分类</el-menu-item>
              <el-menu-item index="specs">商品规格</el-menu-item>
              <el-menu-item index="goods">商品管理</el-menu-item>
              <el-menu-item index="member">会员管理</el-menu-item>
              <el-menu-item index="banner">轮播图管理</el-menu-item>
              <el-menu-item index="seckill">秒杀活动</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
        </el-menu>
      </el-aside>

      <el-container>
        <!-- header -->
        <el-header class="header">
          <h3>{{userInfo.username}}</h3>
          <el-button type="danger" @click="logOut">退出登录</el-button>
        </el-header>
        <el-main>
          <!-- 面包屑效果 -->
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$route.name">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 二级路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    })
  },
  methods: {
    ...mapActions({
      changeUserInfoAction: "changeUserInfoAction"
    }),
    logOut() {
      this.changeUserInfoAction({});
      this.$router.push("/login");
    },
  }
};
</script>

<style scoped>
.contain {
  height: 100vh;
}
.left {
  background: #20222a;
  height: 100vh;
}
.header {
  background-color: #b3c0d1;
  text-align: right;
  line-height: 60px;
}
.header h3 {
  float: right;
}
</style>