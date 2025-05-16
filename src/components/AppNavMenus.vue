<template>
  <el-aside
    :style="{
      width: sideBarWidth,
    }"
  >
    <router-link class="title" to="/">
      <img
        class="icon-logo"
        width="45"
        src="/logo-nav-icon.png"
      />
    </router-link>

    <el-row>
      <el-col :span="24">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#4700f1"
          text-color="#fff"
          active-text-color="#a27cff"
          :default-active="defaultActive"
          unique-opened
          :collapse="isCollapse"
        >
          <el-submenu
            v-for="(item, index) in categorys"
            :key="item._id"
            :index="item._id"
            style="text-align: left"
          >
            <template slot="title">
              <i
                :class="item.icon ? item.icon : `el-icon-eleme icon-title`"
              ></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <el-menu-item
              :index="`${index}-${idx}`"
              v-for="(nav, idx) in item.children"
              :key="nav._id"
              @click="handleMenuItemClick(item._id, nav._id)"
            >
              <a>
                <i :class="nav.icon"></i>
                <span slot="title">{{ nav.name }}</span>
              </a>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>

    <div class="sidebar-fix">
      <ul>
        <li class="item" @click="$emit('showMenus')">
          <i
            class="el-icon-s-fold"
            v-if="!isCollapse"
          ></i>
          <i class="el-icon-s-unfold" v-else></i>
        </li>
      </ul>
    </div>
  </el-aside>
</template>

<script>
export default {
  name: "AppNavMenus",
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    categorys: {
      type: Array,
      default: () => []
    },
    showMenuType: {
      type: String,
      default: 'half'
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      defaultActive: "0-0",
      selectedCategoryId: ""
    };
  },
  computed: {
    sideBarWidth() {
      if (this.showMenuType == 'half') {
        return '60px'
      } else if (this.showMenuType == 'all') {
        return '220px'
      } else {
        return '0'
      }
    },
    isCollapse() {
      return this.showMenuType === 'half'
    }
  },
  methods: {
    handleMenuItemClick(parentId, id) {
      this.$store.commit('saveSeletedId', {
        parentId,
        id,
      })

      if (this.$route.path.includes('/nav')) {
        this.$router.push('/')
        return
      }
      if (this.selectedCategoryId === parentId) {
        document.getElementById(id).scrollIntoView();
        return;
      }
      this.selectedCategoryId = parentId;
      this.$emit("handleSubMenuClick", parentId, id);

    }
  }
};
</script>

<style lang="scss" scoped>
$sidebar-w: auto;

.sidebar-fix {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;

  ul {
    padding: 0;
  }

  .item {
    padding: 10px 15px;
    text-align: left;
    cursor: pointer;
    background: $color-primary;

    i {
      font-size: 20px;
      color: #fff;
    }
  }
}

.el-aside {
  overflow: hidden;
  .el-menu-vertical-demo.el-menu {
    height: 100vh;
    overflow-y: auto;
    padding-bottom: 100px;
    scrollbar-width: thin;
    scrollbar-color: rgba($color-primary, .2) $color-primary;
    -webkit-overflow-scrolling: touch;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
  }
  .el-menu--popup::-webkit-scrollbar,
  .el-menu-vertical-demo.el-menu::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .el-menu--popup::-webkit-scrollbar-thumb,
  .el-menu-vertical-demo.el-menu::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: rgba($color-primary, .2);
  }

  .el-menu--popup::-webkit-scrollbar-track,
  .el-menu-vertical-demo.el-menu::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background: $color-primary;
  }

  background-color: $color-primary;
  color: #6b7386;
  text-align: center;
  transition: width 0.2s ease-out;
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
  will-change: width;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  .el-submenu__title i {
    color: #fff;
  }


  :deep(.el-menu),
  :deep(.el-menu--collapse) {
    border: 0;
    transition: width 0.2s ease-out;
  }

  &.aside-hide {
    transform: translateX(-$sidebar-w);
  }

  &.aside-show {
    transform: translateX(0);
  }

  .title {
    font-size: 16px;
    padding: 15px 0;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    .icon-logo {
      max-width: 100%;
      height: auto;
      transition: all 0.3s;
    }
  }

  .el-submenu__title,
  .el-menu-item {
    text-align: left;
  }

  :deep(.el-menu-item), :deep(.el-submenu__title) {
    transition: none !important;
  }

  :deep(.el-submenu__icon-arrow) {
    transition: transform 0.2s ease-out !important;
  }

  :deep(.el-menu--collapse .el-submenu__title) span,
  :deep(.el-menu--collapse .el-submenu__title) i.el-submenu__icon-arrow {
    display: none;
  }
  
  :deep(.el-menu--collapse) {
    width: 60px !important;
  }

  :deep(.el-menu) {
    width: 220px;
    transition: all 0.2s ease-out;
  }
}

@media screen and (max-width: 568px) {
  .el-aside {
    width: 0 !important;
  }

  .app-search,
  .sidebar-fix {
    display: none;
  }
}
@media screen and (min-width: 569px) {
  .el-aside {
    width: 60px;
  }
}
</style> 