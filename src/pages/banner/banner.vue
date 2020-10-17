<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <form-box :info='info' ref='formBox'></form-box>
    <table-list @edit='edit'></table-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import formBox from "./components/formBox";
import tableList from "./components/tableList";
export default {
  data(){
    return {
      info:{
        isshow:false,
        isAdd:false
      }
    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    willAdd(){
      this.info.isshow=true;
      this.info.isAdd=true;
    },
    edit(e){
      this.info.isshow=true;
      this.info.isAdd=false;
      this.$refs.formBox.look(e);
    }
  },
  components: {
    formBox,
    tableList
  }
};
</script>

<style scoped>
</style>