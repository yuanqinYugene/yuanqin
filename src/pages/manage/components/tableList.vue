<template>
  <div>
    <el-table
      :data="list"
      border
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
      row-key="id"
      :tree-props="{children:'children'}"
    >
      <el-table-column prop="id" label="用户编号" sortable width="180"></el-table-column>

      <el-table-column prop="username" label="用户名称" sortable width="180"></el-table-column>

      <el-table-column prop="rolename" label="所属角色" sortable width="180"></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
          <!-- 公共组件 -->
          <del-btn @del="del(scope.row.uid)"></del-btn> 
        </template>
      </el-table-column>
    </el-table>

     <el-pagination background layout="prev, pager, next" :page-size="size" :total="total"
    @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { reqManageDel } from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list:"manage/list",
      size:"manage/size",
      total:"manage/total"
    })
  },
  methods: {
    ...mapActions({
      reqListAction: "manage/reqListAction",
      reqManageCountAction:"manage/reqManageCountAction",
      changePageAction:"manage/changePageAction"
    }),
    edit(uid) {
      this.$emit('edit',uid);
    },
    del(uid) {
          reqManageDel(uid).then(res=>{
            if(res.data.code==200){
              successAlert(res.data.msg)
              this.reqListAction();
              this.reqManageCountAction();
            }else{
              warningAlert(res.data.msg)
            }
          });
    },
    
    changePage(e){
      console.log(e);//就是对应的页码
      
      this.changePageAction(e);
    }
  },
  mounted() {
    this.reqListAction();
    this.reqManageCountAction();
  }
}
</script>

<style scoped>
</style>