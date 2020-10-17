<template>
  <div>
    <el-dialog :title="info.isAdd ? '添加轮播图' : '编辑轮播图'" :visible.sync="info.isshow" @closed="close">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <!-- 1、原生写文件上传 -->
          <!-- <div class="up_img" v-if="form.pid!=0">
            <img :src="imgUrl" alt v-if="imgUrl" />
            <h3>+</h3>
            <input type="file" @change="getFile" v-if="info.isshow" />
          </div>-->
          <!-- 2、用ele组件写文件上传的方法详见老师的笔记 -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="getFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  reqBannerAdd,
  reqBannerDetail,
  reqBannerUpdate
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      imgUrl: "",
      form: {
        title: "",
        img: null,
        status: 1
      }
    };
  },
  methods: {
    ...mapActions({
      reqListAction: "banner/reqListAction"
    }),
    cancel() {
      this.info.isshow = false;
    },
    add() {
      reqBannerAdd(this.form).then(res => {
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
      this.imgUrl = "";
      this.form = {
        title: "",
        img: null,
        status: 1
      };
    },
    look(id) {
      reqBannerDetail(id).then(res => {
        if (res.data.code == 200) {       
          this.form = res.data.list;
          this.form.id=id;
           this.imgUrl=this.$imgHttp+this.form.img;//此时form里面的img是从后台传来的图片url字符串
           console.log(this.form.img);// 此时是url
           
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      console.log(this.form.img);// 目前还是url
      
      reqBannerUpdate(this.form).then(res => { //这里要传的form.img是file类型，所以如果用户没有修改这张图而是直接点了修改，要保证form.img是文件类型就必须要触发getFile2()重新给form.img赋值
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
    getFile2(e) { //这个函数在添加文件和上传时都调用，所以添加一次图片会调用2次
      let file = e.raw;
      console.log(1,file);
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件不能超过2M");
        return;
      }
      //2.是图片
      let imgExtArr = [".jpg", ".png", ".jpeg", ".gif"];
      let extname = file.name.slice(file.name.lastIndexOf(".")); //'.jpg'
      if (!imgExtArr.some(item => item == extname)) {
        warningAlert("文件格式不正确");
        return;
      }
      //URL.createObjectURL() 可以通过文件生成一个地址
      this.imgUrl = URL.createObjectURL(file);
      //将文件保存在form.img
      this.form.img = file;
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>