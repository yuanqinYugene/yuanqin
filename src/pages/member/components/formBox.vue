<template>
  <div>
    <el-dialog title="编辑会员管理" :visible.sync="info.isshow">
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <p class="p">留空则不修改</p>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isshow=false">取 消</el-button>
        <el-button type="primary" @click="update(form)">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { reqMemberDetail, reqMemberUpdate } from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      },
      rules: {
        nickname: [
          { required: true, message: "该选项不能为空", trigger: "blur" }
        ],
        phone: [{ required: true, message: "该选项不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions({
      reqListAction: "member/reqMemberAction"
    }),
    look(uid) {
      reqMemberDetail(uid).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.password = "";
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          var reg= /^1[3-9]\d{9}$/g;
          if(reg.exec(this.form.phone)==null){
            warningAlert("手机号格式不正确");
            return false;
          }
          reqMemberUpdate(this.form).then(res => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.info.isshow = false;
              this.empty();
              this.reqListAction();
            } else {
              warningAlert(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    empty() {
      this.form = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      };
    }
  }
};
</script>

<style scoped>
.p {
  padding-left: 80px;
  color: #333;
  margin-bottom: 30px;
}
</style>