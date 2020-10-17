<template>
  <div>
    <form-box :info="info" ref="formBox"></form-box>
    <table-list @edit="edit"></table-list>
  </div>
</template>
<script>
import formBox from './components/formBox'
import tableList from './components/tableList'
import { mapGetters, mapActions } from "vuex";
export default {
  props: [],
  components: {
    formBox,
    tableList
  },
  data() {
    return {
      info:{
        isshow:false,
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    edit(e){
      this.info.isshow=true;
      this.info.isAdd=true;
      this.$refs.formBox.look(e);
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>