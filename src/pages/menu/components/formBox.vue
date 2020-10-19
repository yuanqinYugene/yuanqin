<template>
  <div>
    <el-dialog :title="info.isAdd ? '添加菜单' : '编辑菜单'" :visible.sync="info.isshow" @closed="close">
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="上级菜单" prop="pid">
          <el-select v-model="form.pid" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-radio :label="1" v-model="form.type" disabled>目录</el-radio>
          <el-radio :label="2" v-model="form.type" disabled>菜单</el-radio>
        </el-form-item>

        <el-form-item label="菜单图标" v-if="form.type==1" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择菜单图标">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单地址" v-else prop="url">
          <el-select v-model="form.url" placeholder="请选择菜单地址">
            <el-option
              v-for="(item) in chi"
              :key="item.path"
              :label="item.name"
              :value="'/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add(form)" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update(form)" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqMenuAdd,
  reqMenuDetail,
  reqMenuUpdate
} from "../../../utils/request";
import { chi } from "../../../router/index";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      icons: [
        "el-icon-s-tools",
        "el-icon-user",
        "el-icon-camera",
        "el-icon-message-solid"
      ],
      // 二级路由数据，需要将path展示到菜单地址上的
      chi,

      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1
      },
      rules: {
        // 属性名必须与form表单对应的v-model一致，另不需要每个表单都写验证
        title: [{ required: true, message: "该选项不能为空", trigger: "blur" }],
        pid: [{ required: true, message: "该选项不能为空", trigger: "change" }],
        icon: [{ required: true, message: "该选项不能为空", trigger: "change" }],
        url: [{ required: true, message: "该选项不能为空", trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapGetters({
      list: "menu/list"
    })
  },
  methods: {
    ...mapActions({
      actionFun: "menu/actionFun"
    }),
    cancel() {
      this.info.isshow = false;
    },
    changePid() {
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    add(form) {
      // console.log(111,this.$refs[form]); // undefined
      // console.log(111,this.$refs.form); // 实例
      this.$refs.form.validate(valid => {
        if (valid) {
          reqMenuAdd(this.form).then(res => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.empty();
              this.cancel();
              this.actionFun();
            } else {
              warningAlert(res.data.msg);
            }
          });
        } else {
          return false;
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
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1
      };
    },
    look(id) {
      reqMenuDetail(id).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id; //form是没有id的，但是等会发起修改请求时需要给后台传id参数，所以在此处给form设置一个id属性
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          reqMenuUpdate(this.form).then(res => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.info.isshow = false;
              this.empty();
              this.actionFun();
            } else {
              warningAlert(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>