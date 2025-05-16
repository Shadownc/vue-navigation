<template>
  <div v-if="show" class="app-log">
    <el-card>
      <div slot="header" class="clearfix">
        <span>更新日志</span>
        <i class="el-icon-close" style="float: right; cursor: pointer" @click="$emit('closeLog')"></i>
      </div>
      <div>
        <p>项目已经用Vue.js重构完成了原来的Nuxt.js版本</p>
        <p>保留了全部原有功能与界面样式</p>
        <p>Vue.js版本将更加易于部署和维护</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AppLog",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.app-log {
  position: fixed;
  bottom: 30px;
  right: 100px;
  width: 300px;
  z-index: 999;
}
</style> 