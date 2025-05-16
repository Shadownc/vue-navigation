<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  text-rendering: optimizeSpeed;
}

#app {
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* 性能优化 */
* {
  box-sizing: border-box;
}

/* 滚动优化 */
.page-scroll-container {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

img, svg {
  max-width: 100%;
  display: block;
}

/* 性能优化 - 重绘和回流优化 */
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  will-change: transform;
}

/* 变量定义 */
:root {
  --color-primary: #4700f1;
}

/* Element UI 变量覆盖 */
$color-primary: #4700f1;
</style> 