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
      <el-table-column prop="id" label="商品编号" sortable></el-table-column>

      <el-table-column prop="goodsname" label="商品名称" sortable></el-table-column>

      <el-table-column label="商品价格">
        <template slot-scope="scope">
          {{scope.row.price|filterPrice}}
        </template>
      </el-table-column>

            <el-table-column label="市场价格">
        <template slot-scope="scope">
          {{scope.row.market_price|filterPrice}}
        </template>
      </el-table-column>

      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$imgHttp+scope.row.img" alt="">
        </template>
      </el-table-column>

      <el-table-column label="是否新品">
        <template slot-scope="scope">
        <el-button type="primary" v-if="scope.row.isnew==1">是</el-button>
        <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>

       <el-table-column label="是否热卖">
        <template slot-scope="scope">
        <el-button type="primary" v-if="scope.row.ishot==1">是</el-button>
        <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
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
import { reqGoodsDel } from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list:"goods/list",
      total:"goods/total",
      size:"goods/size",
    })
  },
  methods: {
    ...mapActions({
      reqListAction: "goods/reqListAction",
      changePageAction:"goods/changePageAction",
      reqTotalAction:"goods/reqTotalAction"
    }),
    edit(id) {
      this.$emit('edit',id);
      console.log(1,this.list);
    },
    del(id) {
          reqGoodsDel(id).then(res=>{
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