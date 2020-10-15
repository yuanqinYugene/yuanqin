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
      <el-table-column prop="id" label="角色编号" sortable width="180"></el-table-column>

      <el-table-column prop="rolename" label="角色名称" sortable width="180"></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <!-- <el-button type="danger" @click="del(scope.row.id)">删除</el-button> -->
          <!-- 公共组件 -->
          <del-btn @del="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { reqRoleDel } from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "role/list",
    })
  },
  methods: {
    ...mapActions({
      reqListAction: "role/reqListAction"
    }),
    edit(id) {
      this.$emit('edit',id);
    },
    del(id) {
          reqRoleDel(id).then(res=>{
            if(res.data.code==200){
              successAlert(res.data.msg)
              this.reqListAction();
            }else{
              warningAlert(res.data.msg)
            }
          });
    },
  },
  mounted() {
    this.reqListAction();
  }
}
</script>

<style scoped>
</style>