<template>
  <div class="website-item">
    <div class="wrap">
      <div class="link" target="_blank" @click="handleNavClick">
        <el-tooltip content="链接直达" property="top">
          <i class="el-icon-link"></i>
        </el-tooltip>
      </div>
      <router-link :to="`/nav/${navData._id}`" class="info" >
        <div class="info-header">
          <el-image class="logo" :src="navData.logo" fit="cover" lazy />
          <div class="info-header-right">
            <strong class="title">{{ navData.name }}</strong>
            <div class="desc">
              {{ navData.desc || "这个网站什么描述也没有..." }}
            </div>
          </div>
        </div>
      </router-link>
      <div class="website-item__footer">
        <div class="left" v-if="navData.authorUrl">
          <a :href="navData.authorUrl" target="_blank">
            <span class="el-icon-user"></span>
            <span>{{ navData.authorName }}</span>
          </a>
        </div>
        <div class="right">
          <span class="website-item__icon" :class="isView && 'active'">
            <span class="el-icon-view"></span>
            {{ navData.view }}
          </span>
          <span
            class="website-item__icon"
            :class="isStar && 'active'"
            @click="handleNavStar"
          >
            <span class="el-icon-star-off"></span>
            {{ navData.star }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'AppNavItem',
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isStar: false,
      isView: false,
      navData: this.item
    };
  },
  methods: {
    async handleNavStar() {
      try {
        // 发送点赞请求
        await api.updateNavStar(this.navData._id);
        this.navData.star += 1;
        this.isStar = true;
        this.$message.success('点赞成功！');
      } catch (error) {
        console.error('点赞失败:', error);
        this.$message.error('点赞失败，请稍后重试');
      }
    },
    handleNavClick() {
      if (this.navData.href) {
        // 直接打开链接，无需更新浏览量API调用
        window.open(this.navData.href, '_blank');
      } else {
        this.$message.warning('该网站没有提供链接');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$color-primary: #4700f1; // Define the variable directly

.website-item {
  font-size: 12px;
  margin-bottom: 0;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  color: #999;
  position: relative;
  height: 100%;
  
  &:hover {
    .link {
      display: block;
    }
  }

  .link {
    position: absolute;
    right: 10px;
    top: 10px;
    display: none;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  .wrap {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  a {
    color: #999;
  }

  .title {
    color: #4700f1;
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  i {
    margin-right: 0;
    cursor: pointer;
    color: #999;
    font-size: 14px;
  }

  .desc {
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: #666;
  }

  &__footer {
    border-top: 1px solid #f2f2f2;
    background: #fff;
    padding: 8px 12px;
    text-align: right;
    display: flex;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    margin-top: auto;
    
    .left {
      font-size: 12px;
      i {
        margin-left: 0;
      }
      a {
        display: flex;
        align-items: center;
      }
    }
    .right {
      flex: 1;
      text-align: right;
      
      .website-item__icon {
        margin-left: 8px;
      }
    }
  }
  &__icon.active {
    &,
    i {
      color: #4700f1;
    }
  }
}

.info {
  display: block;
  transition: all 0.3s;
  background: #fff;
  padding: 15px 12px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  flex: 1;

  &-header {
    display: flex;
    align-items: center;
    
    &-right {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0; /* Important for text-overflow to work */
    }
  }
}

.logo {
  min-width: 35px;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  margin-right: 10px;
  object-fit: cover;
}
</style> 