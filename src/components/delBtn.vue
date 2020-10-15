<template>
 
    <el-button type="danger" @click="del">删除</el-button>
 
</template>

<script>
export default {
  methods: {
    del() {
      this.$confirm("此操作将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass:"el-button el-button--danger",
        type: "warning"
      })
        .then(() => {
          this.$emit("del");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
</style>