<template>
  <div class="login">
    <div class="box">
      <h3>登录</h3>
      <div>
        <el-input placeholder="请输入账号" v-model="user.username"></el-input>
      </div>
      <div>
        <el-input placeholder="请输入密码" v-model="user.password"></el-input>
      </div>
      <div>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reqManageLogin } from "../utils/request";
import { successAlert, warningAlert } from "../utils/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({
      changeUserInfoAction: "changeUserInfoAction"
    }),
    login() {
      reqManageLogin(this.user).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          console.log(res.data.list);
          
          // 将用户信息存在根状态层中
          this.changeUserInfoAction(res.data.list);
          this.$router.push("/");
        }else{
          warningAlert(res.data.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  /* position: relative; */
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to right, #553443, #303d60);
}
.box {
  width: 400px;
  /* height: 300px; */
  padding: 20px;
  background: #fff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
}
.box h3 {
  font-size: 25px;
  text-align: center;
}
.box div {
  text-align: center;
  margin-top: 10px;
}
</style>