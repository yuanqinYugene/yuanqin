<template>
  <div>
    <el-dialog :title="info.isAdd ? '添加角色' : '编辑角色'" :visible.sync="info.isshow" @closed="close">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>

        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="id"
            :props="{children: 'children',label: 'title',}"
          ></el-tree>
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
import {  reqRoleAdd,  reqRoleDetail,  reqRoleUpdate} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {
        rolename: "",
        menus: "[]",
        status: 1
      }
    };
  },
  mounted() {
    //如果菜单list没有请求过，就请求一下，如果请求过了，就不用请求了
    if (this.menuList.length == 0) {
      this.reqMenuListAction();
    }
  },
  computed: {
    ...mapGetters({
      // 树形控件的数据来源于菜单list，所以需要菜单管理的状态层数据
      menuList: "menu/list"
    })
  },
  methods: {
    ...mapActions({
      // 树形控件的数据来源于菜单管理，所以需要菜单管理的状态层函数
      reqMenuListAction: "menu/actionFun",
      // 角色管理自己的状态层函数
      reqListAction: "role/reqListAction"
    }),
    cancel() {
      this.info.isshow = false;
    },
    add() {
      // menus需要提交给后台的，但是后台要求是字符串数组的格式，所以从树形控件中获取到选中的内容后再JSON.stringify转化一下
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleAdd(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.info.isshow = false;
          this.reqListAction();
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
        rolename: "",
        menus: "[]",
        status: 1
      };
      // 清空树形控件
      this.$refs.tree.setCheckedKeys([]);
    },
    look(id) {
      reqRoleDetail(id).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id; //form是没有id的，但是等会发起修改请求时需要给后台传id参数，所以在此处给form设置一个id属性
          // 给树形控件赋值选中的角色所拥有的权限
          this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus));
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys())
      reqRoleUpdate(this.form).then(res => {
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