<template>
  <el-dialog :visible.sync="dialogVisible" title="添加网址" width="30%" @close="handleClose">
    <div class="dialog-content">
      <p>当前为Vue重构版本，添加功能请在原版查看</p>
      <router-link to="/recommend" class="recommend-btn">
        <el-button type="primary">推荐网站</el-button>
      </router-link>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AddNavPopup",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: "",
        url: ""
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:show', false);
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  
  p {
    margin-bottom: 20px;
    color: #606266;
  }
  
  .recommend-btn {
    text-decoration: none;
  }
}
</style> 