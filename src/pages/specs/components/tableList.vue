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
      <el-table-column prop="id" label="规格编号" sortable width="180"></el-table-column>

      <el-table-column prop="specsname" label="规格名称" sortable width="180"></el-table-column>

      <el-table-column label="规格属性">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @del="del(scope.row.id)"></del-btn> 
        </template>
      </el-table-column>
    </el-table>

     <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePageAction"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { reqSpecsDel } from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list:"specs/list",
      total:"specs/total",
      size:"specs/size",
    })
  },
  methods: {
    ...mapActions({
      reqListAction: "specs/reqListAction",
      changePageAction:"specs/changePageAction",
      reqTotalAction:"specs/reqTotalAction"
    }),
    edit(id) {
      this.$emit('edit',id);
    },
    del(id) {
          reqSpecsDel(id).then(res=>{
            if(res.data.code==200){
              successAlert(res.data.msg)
              this.reqListAction();
              this.reqTotalAction();
            }else{
              warningAlert(res.data.msg)
            }
          });
    }
  },
  mounted() {
    this.reqListAction();
    this.reqTotalAction();    
  }
}
</script>

<style scoped>
img{
  width: 100px;
  height: 100px;
}
</style>