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
        return '60px'
      } else if (this.showMenuType === 'all') {
        return '220px'
      } else {
        return '0'
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
  height: 100%;
}

.user-layout {
  position: relative;
  height: 100vh;
  overflow: hidden;
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
    transition: margin-left 0.2s ease-out;
    will-change: margin-left;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
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
  padding: 25px 30px;
  background-color: #f8f9fa;
  background-image: linear-gradient(to bottom, #f5f7ff 0%, #f8f9fa 100%);
  flex: 1;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  overscroll-behavior: contain;
}

.website-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  position: relative;
  padding-left: 16px;
  margin-top: 40px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 24px;
    background-color: var(--color-primary, #4700f1);
    border-radius: 3px;
    box-shadow: 0 2px 6px rgba(71, 0, 241, 0.3);
  }
  
  &:after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, #eee, transparent);
    margin-left: 15px;
  }
}

.website-wrapper {
  margin-bottom: 40px;
  animation: fadeIn 0.5s ease;
  transform: translateZ(0);
  backface-visibility: hidden;
  
  &:first-child {
    .website-title {
      margin-top: 10px;
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

@media (max-width: 768px) {
  .main {
    padding: 15px;
  }
  
  .website-title {
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 20px;
    
    &:before {
      height: 20px;
    }
  }
  
  .website-wrapper {
    margin-bottom: 30px;
    
    &:first-child {
      .website-title {
        margin-top: 5px;
      }
    }
  }
}
</style> 