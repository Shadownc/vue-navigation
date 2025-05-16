<template>
  <div class="customer-service">
    <button class="btn">
      <i class="el-icon-message-solid" @click="$emit('showLog')"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: "CustomerServiceBtn"
}
</script>

<style scoped lang="scss">
.customer-service {
  position: fixed;
  bottom: 100px;
  right: 30px;
  .btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: $color-primary; /* 使用全局变量 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border: none;
    color: #fff;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
  }
}
</style> 