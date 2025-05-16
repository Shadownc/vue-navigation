<template>
  <div class="nav-detail-page page-scroll-container">
    <!-- Header -->
    <div class="page-header">
      <div class="container header-container">
        <router-link to="/" class="back-button">
          <i class="el-icon-arrow-left"></i>
          <span>返回首页</span>
        </router-link>
        <h2 class="page-title">
          <i class="el-icon-collection"></i>
          网站详情
        </h2>
      </div>
    </div>

    <!-- Hero Section with Background -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container hero-content" v-loading="loading">
        <div class="website-profile">
          <div class="website-logo">
            <el-image :src="detail.logo" class="logo-image" />
            <div class="stats">
              <div class="stat-item">
                <i class="el-icon-view"></i>
                <span>{{ detail.view }}</span>
              </div>
              <div class="stat-item" :class="{ active: isStar }" @click="handleNavStarFn">
                <i class="el-icon-star-off"></i>
                <span>{{ detail.star }}</span>
              </div>
            </div>
          </div>
          <div class="website-info">
            <h1 class="website-title">{{ detail.name }}</h1>
            <div class="website-desc">{{ detail.desc }}</div>
            
            <div class="tags-container" v-if="detail.tags && detail.tags.length">
              <span class="tag" v-for="tag in detail.tags" :key="tag">{{ tag }}</span>
            </div>
            
            <div class="author-info" v-if="detail.authorName">
              <i class="el-icon-user"></i>
              <span>推荐人：</span>
              <a :href="detail.authorUrl" target="_blank">{{ detail.authorName }}</a>
            </div>

            <div class="actions">
              <button class="action-button" @click="handleNavClick(detail)">
                <i class="el-icon-link"></i>
                <span>访问网站</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container main-content" v-loading="loading">
      <div class="content-grid">
        <!-- Left Column - Main Content -->
        <div class="main-column">
          <!-- Preview Section -->
          <div class="content-card preview-section">
            <div class="card-header">
              <h3><i class="el-icon-picture-outline"></i> 网站预览</h3>
            </div>
            <div class="card-body">
              <div v-if="!detail.screenshots || detail.screenshots.length === 0" class="empty-preview">
                <div class="empty-icon">
                  <i class="el-icon-picture"></i>
                </div>
                <p>该网站暂无预览图</p>
                
                <!-- Features section when no screenshots -->
                <div class="features-list">
                  <h4>网站特点</h4>
                  <div class="features-grid">
                    <div class="feature-item" v-for="(feature, index) in getFeatures()" :key="index">
                      <div class="feature-icon">
                        <i class="el-icon-check"></i>
                      </div>
                      <div class="feature-text">{{ feature }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="preview-carousel">
                <el-carousel :interval="4000" height="400px" indicator-position="outside">
                  <el-carousel-item v-for="(img, index) in detail.screenshots" :key="index">
                    <img :src="img" :alt="`${detail.name}截图${index+1}`" class="preview-img">
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="content-card description-section">
            <div class="card-header">
              <h3><i class="el-icon-document"></i> 网站描述</h3>
            </div>
            <div class="card-body">
              <div class="description-content">
                {{ detail.detail || detail.desc }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Sidebar -->
        <div class="side-column">
          <!-- Website Info Card -->
          <div class="content-card website-meta">
            <div class="card-header">
              <h3><i class="el-icon-info"></i> 网站信息</h3>
            </div>
            <div class="card-body">
              <div class="meta-list">
                <div class="meta-item">
                  <div class="meta-label">
                    <i class="el-icon-link"></i>
                    <span>网站链接：</span>
                  </div>
                  <div class="meta-value">
                    <a :href="detail.href" target="_blank" v-if="detail.href">{{ formatUrl(detail.href) }}</a>
                    <span v-else>暂无</span>
                  </div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">
                    <i class="el-icon-view"></i>
                    <span>访问次数：</span>
                  </div>
                  <div class="meta-value">{{ detail.view || 0 }}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">
                    <i class="el-icon-star-off"></i>
                    <span>点赞数：</span>
                  </div>
                  <div class="meta-value">{{ detail.star || 0 }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Sites Card -->
          <div class="content-card related-sites">
            <div class="card-header">
              <h3><i class="el-icon-connection"></i> 随机网址</h3>
              <button class="refresh-button" @click="getRandomNavList" title="刷新列表">
                <i class="el-icon-refresh"></i>
              </button>
            </div>
            <div class="card-body">
              <div class="related-list">
                <router-link 
                  v-for="item in randomNavList" 
                  :key="item._id" 
                  :to="`/nav/${item._id}`" 
                  class="related-item"
                  :title="item.name"
                >
                  <div class="related-logo">
                    <img :src="item.logo" :alt="item.name">
                  </div>
                  <div class="related-content">
                    <div class="related-name" :title="item.name">{{ item.name }}</div>
                    <div class="related-desc" :title="item.desc">{{ item.desc }}</div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  watch: {
    // 监听路由参数变化，当ID变化时重新获取详情
    '$route.params.id': {
      handler(newId) {
        this.getNavDetail(newId);
        this.isStar = false;
        window.scrollTo(0, 0);
      },
      immediate: false
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
      if (nav.href) {
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
      } catch (error) {
        console.error("获取导航详情失败:", error);
        this.$message.error('获取导航详情失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    getFeatures() {
      if (this.detail.features && Array.isArray(this.detail.features)) {
        return this.detail.features;
      }
      
      const desc = this.detail.desc || '';
      if (desc.length > 20) {
        const sentences = desc.split(/[.,;，。；]/);
        return sentences.filter(s => s.trim().length > 5).slice(0, 3);
      }
      
      return ['便捷的操作界面', '丰富的功能', '良好的用户体验'];
    },
    formatUrl(url) {
      if (!url) return '';
      return url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
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
.nav-detail-page {
  height: 100vh;
  overflow-y: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

// Variables
$color-primary: var(--color-primary, #4700f1);
$color-primary-dark: #3600c5;
$color-primary-light: rgba(71, 0, 241, 0.08);
$color-gray-100: #f8f9fa;
$color-gray-200: #e9ecef;
$color-gray-300: #dee2e6;
$color-gray-400: #ced4da;
$color-gray-500: #adb5bd;
$color-gray-600: #6c757d;
$color-gray-700: #495057;
$color-gray-800: #343a40;
$color-gray-900: #212529;
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$transition-fast: 0.2s ease;
$transition-normal: 0.3s ease;
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

// Base Styles
.nav-detail-page {
  background-color: $color-gray-100;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

// Header
.page-header {
  background-color: #fff;
  box-shadow: $shadow-sm;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  display: flex;
  align-items: center;
  color: $color-primary;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: $radius-md;
  background-color: $color-primary-light;
  transition: all $transition-normal;
  
  i {
    margin-right: 8px;
    font-size: 16px;
  }
  
  &:hover {
    transform: translateX(-3px);
    background-color: rgba(71, 0, 241, 0.12);
  }
}

.page-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: $color-gray-800;
  
  i {
    margin-right: 10px;
    color: $color-primary;
  }
}

// Hero Section
.hero-section {
  position: relative;
  padding: 80px 0 40px;
  background: linear-gradient(135deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%);
  color: white;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.website-profile {
  display: flex;
  align-items: flex-start;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  padding: 30px;
  box-shadow: $shadow-lg;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.website-logo {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
  
  .logo-image {
    width: 120px;
    height: 120px;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    margin-bottom: 20px;
    background-color: white;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
  
  .stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 16px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: $radius-md;
      cursor: pointer;
      transition: all $transition-normal;
      margin: 0 5px;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-3px);
      }
      
      &.active {
        background-color: rgba(255, 255, 255, 0.4);
        
        i, span {
          color: #ff9500;
        }
      }
      
      i {
        font-size: 18px;
        margin-bottom: 4px;
      }
      
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.website-info {
  flex: 1;
  min-width: 0;
}

.website-title {
  margin: 0 0 15px;
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.website-desc {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  
  .tag {
    display: inline-block;
    padding: 5px 12px;
    background-color: rgba(255, 255, 255, 0.25);
    color: white;
    border-radius: 30px;
    font-size: 13px;
    margin-right: 10px;
    margin-bottom: 10px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all $transition-fast;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.35);
      transform: translateY(-2px);
    }
  }
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
  opacity: 0.85;
  
  i {
    margin-right: 5px;
  }
  
  span {
    margin-right: 5px;
  }
  
  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.7);
    
    &:hover {
      border-bottom-style: solid;
    }
  }
}

.actions {
  display: flex;
  
  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 25px;
    background-color: white;
    color: $color-primary;
    border: none;
    border-radius: $radius-md;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-normal;
    box-shadow: $shadow-md;
    
    i {
      margin-right: 8px;
      font-size: 16px;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: $shadow-lg;
    }
  }
}

// Main Content
.main-content {
  margin-top: -20px;
  padding-bottom: 60px;
  position: relative;
  z-index: 3;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-gap: 25px;
}

.content-card {
  background-color: white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
  transition: all $transition-normal;
  margin-bottom: 25px;
  
  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-5px);
  }
  
  .card-header {
    padding: 20px 25px;
    border-bottom: 1px solid $color-gray-200;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: $color-gray-800;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 10px;
        color: $color-primary;
        font-size: 18px;
      }
    }
  }
  
  .card-body {
    padding: 25px;
  }
}

// Preview Section
.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: $color-primary-light;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    
    i {
      font-size: 32px;
      color: $color-primary;
    }
  }
  
  p {
    font-size: 16px;
    color: $color-gray-600;
    margin-bottom: 30px;
  }
}

.features-list {
  width: 100%;
  max-width: 800px;
  
  h4 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: $color-gray-800;
    text-align: center;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  
  .feature-item {
    display: flex;
    align-items: flex-start;
    padding: 15px;
    background-color: $color-gray-100;
    border-radius: $radius-md;
    transition: all $transition-fast;
    
    &:hover {
      background-color: $color-primary-light;
      transform: translateY(-3px);
    }
    
    .feature-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      flex-shrink: 0;
      box-shadow: $shadow-sm;
      
      i {
        color: $color-primary;
        font-size: 16px;
      }
    }
    
    .feature-text {
      font-size: 14px;
      color: $color-gray-800;
      line-height: 1.5;
    }
  }
}

.preview-carousel {
  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: $color-gray-100;
  }
}

// Description Section
.description-content {
  font-size: 15px;
  line-height: 1.8;
  color: $color-gray-700;
}

// Website Meta
.meta-list {
  .meta-item {
    display: flex;
    flex-direction: column;
    padding: 12px 0;
    border-bottom: 1px solid $color-gray-200;
    
    &:last-child {
      border-bottom: none;
    }
    
    .meta-label {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: $color-gray-600;
      font-size: 14px;
      
      i {
        margin-right: 8px;
        color: $color-primary;
      }
    }
    
    .meta-value {
      font-size: 15px;
      color: $color-gray-800;
      word-break: break-all;
      
      a {
        color: $color-primary;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// Related Sites Card
.related-sites {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .refresh-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background-color: $color-primary-light;
      border: none;
      cursor: pointer;
      transition: all $transition-normal;
      
      i {
        color: $color-primary;
        font-size: 16px;
      }
      
      &:hover {
        background-color: rgba(71, 0, 241, 0.15);
        transform: rotate(180deg);
      }
    }
  }
}

.related-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 10px;
  
  .related-item {
    display: flex;
    align-items: flex-start;
    text-decoration: none;
    padding: 15px;
    border-radius: $radius-md;
    background-color: $color-gray-100;
    border: 1px solid transparent;
    transition: all $transition-normal;
    height: 100%;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    
    &:hover {
      background-color: white;
      transform: translateY(-3px);
      border-color: $color-gray-300;
      box-shadow: $shadow-md;
      
      .related-name {
        color: $color-primary;
      }
    }
    
    .related-logo {
      width: 42px;
      height: 42px;
      min-width: 42px;
      border-radius: $radius-md;
      overflow: hidden;
      margin-right: 14px;
      background-color: white;
      box-shadow: $shadow-sm;
      border: 1px solid $color-gray-200;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        width: 90%;
        height: 90%;
        object-fit: contain;
      }
    }
    
    .related-content {
      flex: 1;
      min-width: 0;
      width: calc(100% - 56px);
      overflow: hidden;
      padding-top: 2px;
    }
    
    .related-name {
      font-size: 14px;
      font-weight: 600;
      color: $color-gray-800;
      margin-bottom: 6px;
      transition: all $transition-fast;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      display: block;
    }
    
    .related-desc {
      font-size: 12px;
      color: $color-gray-600;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      max-height: 1.4em;
      width: 100%;
    }
  }
}

.content-card.related-sites {
  .card-body {
    padding: 20px 22px 25px;
  }
}

// Responsive
@media (max-width: $breakpoint-lg) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .side-column {
    max-width: 100%;
  }
  
  .related-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: $breakpoint-md) {
  .website-profile {
    flex-direction: column;
  }
  
  .website-logo {
    margin-right: 0;
    margin-bottom: 30px;
    width: 100%;
    
    .logo-image {
      width: 100px;
      height: 100px;
    }
  }
  
  .hero-section {
    padding: 60px 0 30px;
  }
  
  .website-title {
    font-size: 26px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .related-list {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
  }
  
  .back-button span {
    display: none;
  }
}

@media (max-width: $breakpoint-sm) {
  .hero-content {
    padding: 0 15px;
  }
  
  .website-profile {
    padding: 20px;
  }
  
  .card-header, .card-body {
    padding: 15px;
  }
  
  .meta-list .meta-item {
    flex-direction: column;
  }
  
  .related-list {
    grid-template-columns: 1fr;
    grid-gap: 12px;
  }
  
  .related-item {
    padding: 12px;
    
    .related-logo {
      width: 40px;
      height: 40px;
      min-width: 40px;
      margin-right: 12px;
    }
    
    .related-content {
      width: calc(100% - 52px);
    }
    
    .related-name {
      font-size: 13px;
      margin-bottom: 4px;
    }
    
    .related-desc {
      font-size: 12px;
    }
  }
  
  .preview-carousel {
    :deep(.el-carousel), :deep(.el-carousel__container) {
      height: 250px !important;
    }
  }
}

// Deep selectors for element-UI components
:deep(.el-carousel__indicators) {
  bottom: 20px;
}

:deep(.el-carousel__indicator) {
  button {
    background-color: rgba(255, 255, 255, 0.5);
  }
  
  &.is-active button {
    background-color: $color-primary;
  }
}

:deep(.el-carousel__arrow) {
  background-color: rgba(71, 0, 241, 0.6);
  
  &:hover {
    background-color: rgba(71, 0, 241, 0.8);
  }
}
</style> 