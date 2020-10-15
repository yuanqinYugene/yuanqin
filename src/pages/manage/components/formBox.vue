<template>
  <div>
    <el-dialog :title="info.isAdd ? '添加管理员' : '编辑管理员'" :visible.sync="info.isshow" @closed="close">
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="所属角色">
          <el-select v-model="form.roleid">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="item in roleList" :key="item.id" :label="item.rolename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {  reqManageAdd,  reqManageDetail,  reqManageUpdate} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {
       // 注意后端要求提交的rolieid是number类型，这里写的空字符串是因为绑定了下拉菜单，
       // 如果初始值是个数字会直接显示在下拉菜单的select上，所以用空字符串和“请选择”option的value=""对应上，
       // 这样显示上去的就是这个option的内容了
        roleid: "", 
        username: "",
        password: "",
        status: 1
      }
    };
  },
  mounted() {
    //如果角色list没有请求过，就请求一下，如果请求过了，就不用请求了
    if (this.roleList.length == 0) {
      this.reqRoleListAction();
    }
  },
  computed: {
    ...mapGetters({
      // 角色管理的状态数据
      roleList: "role/list",
    })
  },
  methods: {
    ...mapActions({
      // 管理员管理自己的状态层函数：
      reqListAction: "manage/reqListAction",
      reqManageCountAction:"manage/reqManageCountAction",
      // 角色管理的状态层函数
      reqRoleListAction: "role/reqListAction",
    }),
    cancel() {
      this.info.isshow = false;
    },
    add() {
      reqManageAdd(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.info.isshow = false;
          this.reqListAction();
          this.reqManageCountAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    empty() {
      this.form = {
        roleid: "", 
        username: "",
        password: "",
        status: 1
      };
    },
    look(uid) {
      reqManageDetail(uid).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.password="";
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      reqManageUpdate(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.info.isshow = false;
          this.empty();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>