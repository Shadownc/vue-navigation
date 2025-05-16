<template>
  <div class="app-nav-list">
    <el-row :gutter="24">
      <el-col 
        :lg="4" 
        :md="6" 
        :sm="8" 
        :xs="12" 
        v-for="(item, index) in list" 
        :key="item._id" 
        class="nav-item-col"
        :style="{'animation-delay': index * 0.05 + 's'}"
      >
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
  margin-bottom: 35px;
  
  .el-row {
    margin-left: -12px !important;
    margin-right: -12px !important;
    
    .el-col {
      padding-left: 12px !important;
      padding-right: 12px !important;
      margin-bottom: 24px;
    }
  }
  
  .nav-item-col {
    animation: fadeInUp 0.5s ease both;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .app-nav-list {
    .el-row {
      margin-left: -8px !important;
      margin-right: -8px !important;
      
      .el-col {
        padding-left: 8px !important;
        padding-right: 8px !important;
        margin-bottom: 16px;
      }
    }
  }
}
</style> 