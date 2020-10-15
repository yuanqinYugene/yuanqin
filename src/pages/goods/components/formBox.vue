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
          <el-select v-model="form.first_cateid" @change="changeFirstCateList">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>

        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>

        <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <!-- 1、原生写文件上传 -->
          <div class="up_img">
            <img :src="imgUrl" v-if="imgUrl" />
            <h3>+</h3>
            <input type="file" @change="getFile" v-if="info.isshow" />
          </div>
          <!-- 2、用ele组件写文件上传的方法详见老师的笔记 -->
        </el-form-item>

        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="changeSpecs">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in specsList"
              :value="item.id"
              :key="item.id"
              :label="item.specsname"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品属性">
          <el-select v-model="form.specsattr" multiple>
            <el-option label="请选择" value disabled></el-option>
            <el-option v-for="item in specsAttr" :value="item" :key="item" :label="item"></el-option>
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
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsUpdate,
  reqCateList,
  // reqSpecsList 无须引入此接口发起请求，因为在specsList中自带下一级目录
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      imgUrl: "",
      secondCateList: [],
      specsAttr:[],
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端需要的是"[]"
        isnew: 1,
        ishot: 1,
        status: 1
      }
    };
  },
  mounted() {
    // 如果商品分类list没有请求过就请求一次，这里需要获取cate的list,所以必须通过actions里的函数来发请求并做then处理
    if (this.cateList.length == 0) {
      this.reqCateListAction();
    }
    // 请求商品规格数据，由于商品规格的请求是分页的，这里不需要分页需要全部数据，所以传值true告诉specs的请求list函数需要请求全部数据
    this.reqSpecsListAction(true);
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      specsList: "specs/list"
    })
  },
  methods: {
    ...mapActions({
      reqListAction: "goods/reqListAction",
      reqTotalAction: "goods/reqTotalAction",
      reqCateListAction: "cate/reqListAction",
      reqSpecsListAction: "specs/reqListAction"
    }),
    changeFirstCateList() {
      //一级分类变了，二级分类的值应该置空,让客户重新选择二级分类
      this.form.second_cateid = "";
      // 获取对应的二级分类
      this.getSecondCateList();
    },
    getSecondCateList() {
      // 这里无须用cate.js里的actions里的函数来发请求，这里只需要请求拿到数据然后自己做then处理，所以用的是cate的请求函数就可
      reqCateList({ pid: this.form.first_cateid }).then(res => {
        this.secondCateList = res.data.list;
      });
    },
    changeSpecs(){
      this.form.specsattr=[];
      this.getSpecsAttr();
    },
    getSpecsAttr(){
      let obj=this.specsList.find(item=>item.id==this.form.specsid);
      this.specsAttr=obj.attrs;
    },
    cancel() {
      this.info.isshow = false;
    },

    add() {
       /*
     let data=this.form;
     data.specsattr=JSON.stringify(this.form.specsattr)
     */
      this.form.description=this.editor.txt.html();
      let data={
        ...this.form,
        specsattr:JSON.stringify(this.form.specsattr)
      }
      reqGoodsAdd(data).then(res => {
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
      this.editor.txt.html(this.form.description);
    },
    empty() {
      this.imgUrl = "";
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端需要的是"[]"
        isnew: 1,
        ishot: 1,
        status: 1
      };
    },
    look(id) {
      reqGoodsDetail(id).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id=id;
          this.getSecondCateList();
          this.imgUrl=this.$imgHttp+this.form.img;
          this.form.specsattr=JSON.stringify(this.form.specsattr);
          this.getSpecsAttr();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.description=this.editor.txt.html();
      let data={
        ...this.form,
        specsattr:JSON.stringify(this.form.specsattr)
      }
      reqGoodsUpdate(data).then(res => {
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
    getFile(e) {
      let file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("图片不能大于2M");
        return;
      }
      let imgArr = [".jpg", ".jpeg", ".png", ".gif"];
      let imgType = file.name.slice(file.name.lastIndexOf("."));
      if (!imgArr.some(item => imgType == item)) {
        warningAlert("文件格式不正确");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      // console.log(this.imgUrl);//完成的包括域名的url

      this.form.img = file;
    }
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