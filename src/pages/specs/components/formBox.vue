<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品规格' : '编辑商品规格'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>

        <el-form-item label="规格属性" v-for="(item,index) in attrArr" :key="index">
          <div class="attr1">
            <el-input v-model="item.value" class="input"></el-input>
            <el-button v-if="index==0" type="primary" @click="addAttr">新增规格属性</el-button>
            <el-button v-else type="danger" @click="delAttr(index)">删除</el-button>
          </div>
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
import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      attrArr: [{ value: "" }, { value: "" }],
      form: {
        specsname: "",
        attrs: "[]",
        status: 1
      },
      rules:{
        
      }
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({
      reqListAction: "specs/reqListAction",
      reqTotalAction: "specs/reqTotalAction"
    }),
    cancel() {
      this.info.isshow = false;
    },
    //验证数据是否合格
    checkedData() {
      //验证规格名称
      if (this.form.specsname == "") {
        warningAlert("规格名称不能为空");
        return false;
      }

      //验证每一个属性值都不能为空
      if (this.attrArr.some(item => item.value == "")) {
        warningAlert("所有的属性值都必填");
        return false;
      }
      return true;
    },
    add() {
      if (!this.checkedData()) {
        return;
      }

      this.form.attrs = JSON.stringify(this.attrArr.map(item => item.value));
      reqSpecsAdd(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.info.isshow = false;
          this.reqListAction();
          this.reqTotalAction();
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
      this.attrArr = [{ value: "" }, { value: "" }];
      this.form = {
        specsname: "",
        attrs: "[]",
        status: 1
      };
    },
    look(id) {
      reqSpecsDetail(id).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list[0];
          this.attrArr = JSON.parse(this.form.attrs).map(item => ({value:item}));
         
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      if (!this.checkedData()) {
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map(item => item.value));
      reqSpecsUpdate(this.form).then(res => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.info.isshow = false;
          this.empty();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 点击添加规格属性按钮
    addAttr() {
      this.attrArr.push({ value: "" });
    },
    // 点击删除规格属性按钮
    delAttr(index) {
      this.attrArr.splice(index,1)
    }
  }
};
</script>

<style scoped>
.attr1 {
  display: flex;
}
.attr1 .input {
  flex: 1;
}
</style>