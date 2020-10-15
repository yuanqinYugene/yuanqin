<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品' : '编辑商品'"
      :visible.sync="info.isshow"
      @closed="close"
      @opened="opened"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid">
            <el-option label="请选择" :value="0"></el-option>
            <!-- 此处是循环 -->
            <el-option label="家电" value></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid">
            <el-option label="请选择" :value="0"></el-option>
            <!-- 此处是循环 -->
            <el-option label="冰箱" value></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>

        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>

        <el-form-item label="市场a价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <!-- 1、原生写文件上传 -->
          <div class="up_img">
            <img :src="$imgHttp+imgUrl">
            <h3>+</h3>
            <input type="file" @change="getFile" v-if="info.isshow" />
          </div>
          <!-- 2、用ele组件写文件上传的方法详见老师的笔记 -->
        </el-form-item>

        <el-form-item label="商品规格">
          <el-select v-model="form.specsid">
            <el-option label="请选择" :value="0"></el-option>
            <!-- 此处是循环 -->
            <el-option label="家电" value></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品属性">
          <el-select v-model="form.specsattr">
            <el-option label="请选择" :value="0"></el-option>
            <!-- 此处是循环 -->
            <el-option label="家电" value></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio :label="1" v-model="form.isnew">是</el-radio>
          <el-radio :label="2" v-model="form.isnew">否</el-radio>
        </el-form-item>

        <el-form-item label="是否热卖">
          <el-radio :label="1" v-model="form.ishot">是</el-radio>
          <el-radio :label="2" v-model="form.ishot">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>

        <el-form-item label="商品描述">
          <div id="editor" v-if="info.isshow"></div>
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
import E from "wangeditor";
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
      imgUrl:"",
      form: {
        first_cateid:"",
        second_cateid:"",
        goodsname:"",
        price:"",
        market_price:"",
        img:null,
        description:"",
        specsid:"",
        specsattr:[],//后端需要的是"[]"
        isnew:1,
        ishot:1,
        status:1
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
    opened() {
      this.editor = new E("#editor");
      this.editor.create();
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
          this.attrArr = JSON.parse(this.form.attrs).map(item => ({
            value: item
          }));
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
    getFile() {}
  }
};
</script>

<style scoped>
.up_img {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}
.up_img img {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 0;
  top: 0;
}
.up_img h3 {
  font-size: 40px;
  text-align: center;
  line-height: 150px;
  color: #ccc;
}
.up_img input {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>