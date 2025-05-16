<template>
  <div>
    <div class="page-header">
      <div class="container header-container">
        <router-link to="/" class="back-button">
          <i class="el-icon-arrow-left"></i> 返回首页
        </router-link>
        <h2 class="page-title">网站详情</h2>
      </div>
    </div>
    <div class="background-gradient"></div>
    <div class="container main-container" v-loading="loading">
      <el-row :gutter="25" class="site-info">
        <el-col class="item" :md="6" :xs="24">
          <div class="left">
            <div class="img-wrap">
              <el-image :src="detail.logo"/>
            </div>
            <div class="tool">
              <el-tooltip content="访问数" placement="top">
                <div class="tool-item">
                  <i class="el-icon-view"></i>
                  <p>{{ detail.view }}</p>
                </div>
              </el-tooltip>
              <div style="width: 30px"></div>

              <el-tooltip content="点赞数" placement="top">
                <div :class="`tool-item ${isStar && 'active'}`" @click="handleNavStarFn">
                  <i class="el-icon-star-off"></i>
                  <p>{{ detail.star }}</p>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col class="item" :md="10" :xs="24">
          <div class="content">
            <h1 class="title">{{ detail.name }}</h1>
            <p class="desc">{{ detail.desc }}</p>
            <p class="tags" v-if="detail.tags && detail.tags.length">标签：
              <span v-for="tag in detail.tags" :key="tag">{{tag}}</span>
            </p>
            <p class="author" v-if="detail.authorName">
              <span class="el-icon-user"></span>
              <span>推荐人：</span>
              <a :href="detail.authorUrl">{{detail.authorName}}</a>
            </p>
            <div class="btn-group">
              <div @click="handleNavClick(detail)" class="btn-link btn-group-item">链接直达<i
                class="el-icon-arrow-right"></i></div>
            </div>
          </div>
        </el-col>
        <el-col class="item" :md="8" :xs="24">
          <div class="right">
            <div class="app-card">
              <div class="app-card-header">
                <h3 class="app-card-title">随机网址</h3>
                <div class="app-card-extra"><i class="el-icon-refresh" @click="getRandomNavList"></i></div>
              </div>
              <div class="app-card-content">
                <el-row :gutter="10">
                  <el-col :span="12" v-for="item in randomNavList" :key="item._id">
                    <router-link class="nav-block" :to="`/nav/${item._id}`">
                      <img :src="item.logo" alt="" class="nav-logo">
                      <h4 class="nav-name">{{ item.name }}</h4>
                    </router-link>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="site-detail">
        <el-col :span="18">
          <div class="detail">
            <h3 class="detail-title">网站描述</h3>
            <div class="detail-content">{{ detail.detail || detail.desc }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <aside></aside>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: "NavDetail",
  data() {
    return {
      detail: {},
      randomNavList: [],
      loading: true,
      isStar: false
    }
  },
  methods: {
    async getRandomNavList() {
      try {
        const res = await api.getRandomNavList();
        this.randomNavList = res.data.data;
      } catch (error) {
        console.error("获取随机导航列表失败:", error);
        this.$message.error('获取随机导航列表失败，请稍后重试');
      }
    },
    handleNavStarFn() {
      // 实现点赞功能
      try {
        api.updateNavStar(this.detail._id);
        this.isStar = true;
        this.detail.star += 1;
        this.$message.success('点赞成功！');
      } catch (error) {
        console.error('点赞失败:', error);
        this.$message.error('点赞失败，请稍后重试');
      }
    },
    handleNavClick(nav) {
      // 实现链接直达功能
      if (nav.href) {
        // 直接打开链接，无需更新浏览量API调用
        window.open(nav.href, '_blank');
      } else {
        this.$message.warning('该网站没有提供链接');
      }
    },
    async getNavDetail(id) {
      this.loading = true;
      try {
        const res = await api.getNavDetail(id);
        this.detail = res.data.data;
        document.title = `${this.detail.name} - 导航详情`;
        
        // 无需更新查看次数
      } catch (error) {
        console.error("获取导航详情失败:", error);
        this.$message.error('获取导航详情失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    const navId = this.$route.params.id;
    this.getNavDetail(navId);
    this.getRandomNavList();
  }
}
</script>

<style lang="scss" scoped>
$color-primary: var(--color-primary, #4700f1);
$color-primary-dark: #3600c5; // Darker shade as a fixed value

.page-header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  color: $color-primary;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(-3px);
  }
  
  i {
    margin-right: 5px;
  }
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.background-gradient {
  position: absolute;
  left: 0;
  right: 0;
  height: 300px;
  top: 60px;
  background: linear-gradient(135deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%);
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
  z-index: -1;
  opacity: 0.8;
}

.main-container {
  max-width: 1200px;
  margin: auto;
  padding: 2rem 15px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.site-info {
  font-size: 14px;
  margin-top: 30px;

  .left {
    padding: 30px 20px;
    background: #fff;
    border-radius: 12px;
    position: relative;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .img-wrap {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-image {
      margin-bottom: 40px;
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }

      img {
        width: 100%;
      }
    }

    .tool {
      position: absolute;
      bottom: 20px;
      left: calc(50% - 65px);
      display: flex;

      p {
        margin: 0;
      }

      i {
        padding-right: 0;
      }

      &-item {
        background: #f0f1f4;
        font-size: 12px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        color: #999;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        &.active {
          color: $color-primary;
          background: rgba(71, 0, 241, 0.1);
        }
      }
    }
  }

  .content {
    padding: 25px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
  }

  .title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 50px;
      height: 3px;
      background: $color-primary;
      border-radius: 2px;
    }
  }

  .desc {
    font-size: 15px;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    color: #666;
    line-height: 1.6;
  }
  
  .tags {
    margin-bottom: 15px;
    font-size: 14px;
    color: #666;
    
    span {
      display: inline-block;
      background: rgba(71, 0, 241, 0.08);
      color: $color-primary;
      padding: 3px 10px;
      margin-right: 8px;
      margin-bottom: 5px;
      border-radius: 20px;
      font-size: 12px;
    }
  }
  
  .author {
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
    
    a {
      color: $color-primary;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .btn-group {
    display: flex;
    margin-top: 20px;

    &-item {
      background: $color-primary;
      color: #fff;
      padding: 10px 20px;
      margin-right: 15px;
      display: flex;
      align-items: center;
      border-radius: 6px;
      transition: all .3s;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(71, 0, 241, 0.25);

      &:hover {
        background: $color-primary-dark;
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(71, 0, 241, 0.35);
      }
    }

    i {
      color: #fff;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  
  .app-card {
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 15px;
    }
    
    &-title {
      margin: 0;
      font-size: 16px;
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background-color: $color-primary;
        border-radius: 2px;
      }
    }
    
    &-extra {
      cursor: pointer;
      color: #999;
      transition: all 0.3s ease;
      
      &:hover {
        color: $color-primary;
        transform: rotate(180deg);
      }
    }
    
    .nav-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;
      padding: 12px 8px;
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(71, 0, 241, 0.05);
        transform: translateY(-3px);
      }
      
      .nav-logo {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        margin-bottom: 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.1);
        }
      }
      
      .nav-name {
        margin: 0;
        font-size: 13px;
        font-weight: 500;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
    }
  }
}

.site-detail {
  margin-top: 30px;
  font-size: 15px;

  .detail {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    color: #666;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    &-title {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      color: #333;
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 18px;
        background-color: $color-primary;
        border-radius: 2px;
      }
    }
    
    &-content {
      line-height: 1.8;
    }
  }
}

@media (max-width: 768px) {
  .site-info {
    .item {
      margin-bottom: 20px;
    }
    
    .left {
      padding: 20px 15px;
      
      .img-wrap {
        height: 120px;
      }
      
      .el-image {
        margin-bottom: 25px;
      }
    }
    
    .content {
      padding: 15px 20px;
    }
    
    .title {
      font-size: 20px;
    }
    
    .btn-group-item {
      padding: 8px 15px;
    }
  }
  
  .site-detail {
    margin-top: 20px;
    
    .detail {
      padding: 15px 20px;
    }
  }
}
</style> 