<template>
  <el-container class="user-layout">
    <AppNavMenus
      @handleSubMenuClick="handleSubMenuClick"
      :categorys="category"
      :show-menu-type="showMenuType"
      @showMenus="toggleMenu2"
    />
    <el-container class="body" :style="{ marginLeft: contentMarginLeft }">
      <AppHeader
        @handleShowPopup="showPopup = true"
        @handleShowMenu="toggleMenu"
      />
      <div class="main" v-loading="loading">
        <!-- <affiche /> -->
        <!-- <nav-ranking-list :data="navRanking" /> -->

        <div class="website-wrapper" v-for="item in data" :key="item.name">
            <p class="website-title" :id="item._id">{{ item.name }}</p>
            <app-nav-list :list="item.list" />
          </div>
      </div>
    </el-container>

    <AddNavPopup :show.sync="showPopup" />
    <!-- <CustomerServiceBtn @showLog="showLog = true" /> -->
    <AppLog :show="showLog" @closeLog="showLog = false" />
  </el-container>
</template>

<script>
import AppNavList from "../components/AppNavList";
import AppNavMenus from "../components/AppNavMenus";
import AppHeader from "../components/AppHeader";
// import CustomerServiceBtn from "../components/CustomerServiceBtn";
import AppLog from "../components/AppLog";
// import NavRankingList from "../components/NavRankingList";
// import Affiche from "../components/Affiche";
import AddNavPopup from "../components/AddNavPopup";
import api from '@/api';

export default {
  name: 'Home',
  components: {
    // Affiche,
    // NavRankingList,
    AppLog,
    // CustomerServiceBtn,
    AppNavList,
    AppNavMenus,
    AppHeader,
    AddNavPopup
  },
  data() {
    return {
      loading: false,
      active: "［前端］热门推荐",
      data: [],
      category: [],
      navRanking: {
        view: [],
        star: [],
        news: []
      },
      selfIndex: 0,
      isLeftbar: true,
      showPopup: false,
      showLog: false,
      showMenuType: 'half'
    };
  },

  computed: {
    contentMarginLeft() {
      if (this.showMenuType === 'half') {
        return '70px'
      } else if (this.showMenuType === 'all') {
        return '220px'
      } else {
        return 0
      }
    }
  },

  methods: {
    async getCategoryList() {
      this.loading = true;
      try {
        const response = await api.getCategoryList();
        this.category = response.data.data;

        if (Array.isArray(this.category) && this.category.length > 0) {
          const categoryId = this.category[0]._id;
          this.findNav(categoryId);
        }
      } catch (error) {
        console.error("获取分类列表失败:", error);
        if (this.isCorsError(error)) {
          this.$message.error('跨域请求被拒绝，API服务器可能不允许直接访问');
        } else {
          this.$message.error('获取分类列表失败，请稍后重试');
        }
      } finally {
        this.loading = false;
      }
    },
    
    async findNav(categoryId) {
      this.loading = true;
      try {
        const response = await api.findNav(categoryId);
        this.data = response.data.data;
      } catch (error) {
        console.error("获取导航列表失败:", error);
        if (this.isCorsError(error)) {
          this.$message.error('跨域请求被拒绝，API服务器可能不允许直接访问');
        } else {
          this.$message.error('获取导航列表失败，请稍后重试');
        }
      } finally {
        this.loading = false;
      }
    },
    
    handleSubMenuClick(parentId, id) {
      this.findNav(parentId);
      console.log("Selected menu item ID:", id);
    },
    
    toggleMenu() {
      this.showMenuType = this.showMenuType === 'none' ? 'half' : 'none';
    },
    
    toggleMenu2() {
      this.showMenuType = this.showMenuType === 'half' ? 'all' : 'half';
    },

    isCorsError(error) {
      return (
        error.message && error.message.includes('Network Error') ||
        (error.response && error.response.status === 0) ||
        error.message && error.message.includes('CORS')
      );
    }
  },
  
  created() {
    this.getCategoryList();
    api.getNavRanking().then(res => {
      this.navRanking = res.data.data;
    }).catch(err => {
      console.error("获取排行榜数据失败:", err);
      if (this.isCorsError(err)) {
        this.$message.error('跨域请求被拒绝，API服务器可能不允许直接访问');
      } else {
        this.$message.error('获取排行榜数据失败，请稍后重试');
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  flex-direction: column;
}

.user-layout {
  position: relative;
  .footer {
    position: fixed;
    left: 200px;
    right: 0;
    bottom: 0;
    font-size: 14px;
    color: #999;
  }

  :deep(.el-submenu__title i) {
    color: #fff;
  }

  .body {
    margin-left: 0;
    transition: margin-left 0.3s;
  }
}

:deep(.el-menu--popup-right-start) {
  height: 500px !important;
  overflow: auto;
}

body {
  .el-menu--popup-right-start {
    background-color: #fff !important;
    .el-menu-item {
      background-color: #fff !important;
      color: #333 !important;
      &:hover {
        background-color: #f5f5f5 !important;
      }
    }
  }
}

.main {
  overflow-y: auto;
  height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f5f5f5;
}

.website-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  position: relative;
  padding-left: 15px;
  margin-top: 30px;
  margin-bottom: 20px;
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background-color: var(--color-primary, #4700f1);
    border-radius: 2px;
  }
}

.website-wrapper {
  margin-bottom: 30px;
  
  &:first-child {
    .website-title {
      margin-top: 0;
    }
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.website-wrapper {
  animation: fadeIn 0.5s ease-out;
}

/* 滚动条样式 */
.main::-webkit-scrollbar {
  width: 8px;
}

.main::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.main::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.main::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 