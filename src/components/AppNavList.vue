<template>
  <div class="app-nav-list">
    <el-row :gutter="20">
      <el-col :lg="4" :md="6" :sm="8" :xs="12" v-for="item in list" :key="item._id">
        <app-nav-item :item="item" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AppNavItem from "./AppNavItem";

export default {
  name: "AppNavList",
  components: {
    AppNavItem
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.app-nav-list {
  margin-bottom: 30px;
  
  .el-row {
    margin-left: -10px !important;
    margin-right: -10px !important;
    
    .el-col {
      padding-left: 10px !important;
      padding-right: 10px !important;
      margin-bottom: 20px;
    }
  }
}
</style> 