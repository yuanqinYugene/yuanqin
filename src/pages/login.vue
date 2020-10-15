<template>
  <div class="login">
    <div class="box">
      <h3>登录</h3>
      <div>
        <el-input placeholder="请输入账号"></el-input>
      </div>
      <div>
        <el-input placeholder="请输入密码"></el-input>
      </div>
      <div>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$router.push("/");
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