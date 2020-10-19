<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品分类' : '编辑商品分类'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="form.pid">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.catename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>

        <el-form-item label="图片" v-if="form.pid!=0">
          <!-- 1、原生写文件上传 -->
          <div class="up_img">
            <img :src="imgUrl" v-if="imgUrl" />
            <h3>+</h3>
            <input type="file" @change="getFile" v-if="info.isshow" />
          </div>
          <!-- 2、用ele组件写文件上传的方法详见老师的笔记 -->
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add(form)" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqCateAdd,
  reqCateDetail,
  reqCateUpdate
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      imgUrl: "",
      form: {
        pid: 0,
        catename: "",
        img: null,
        status: 1
      },
      rules: {
        pid: [{ required: true, message: "该选项不能为空", trigger: "change" }],
        catename: [
          { required: true, message: "该选项不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({
      list: "cate/list"
    })
  },
  methods: {
    ...mapActions({
      reqListAction: "cate/reqListAction"
    }),
    cancel() {
      this.info.isshow = false;
    },
    add(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          reqCateAdd(this.form).then(res => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              this.empty();
              this.info.isshow = false;
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
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    empty() {
      this.imgUrl = "";
      this.form = {
        pid: 0,
        catename: "",
        img: null,
        status: 1
      };
    },
    look(id) {
      reqCateDetail(id).then(res => {
        if (res.data.code == 200) {
          console.log(res);

          this.form = res.data.list;
          this.form.id = id;
          this.imgUrl = this.$imgHttp + this.form.img;
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          reqCateUpdate(this.form).then(res => {
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
    getFile(e) {
      // console.log(e);
      let file = e.target.files[0];
      console.log(1, file);

      // 判断图片的大小是否大于2M，size的单位是B
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("图片不能大于2M");
        return;
      }
      // 判断是否是图片格式
      let imgType = file.name.slice(file.name.lastIndexOf("."));
      let imgArr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!imgArr.some(item => item == imgType)) {
        warningAlert("文件格式不正确");
        return;
      }

      // console.log(URL.createObjectURL(file));
      this.imgUrl = URL.createObjectURL(file);
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