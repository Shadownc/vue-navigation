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
$transition-speed: 0.3s;

.website-item {
  font-size: 12px;
  margin-bottom: 0;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-speed;
  color: #999;
  position: relative;
  height: 100%;
  
  &:hover {
    .link {
      opacity: 1;
      transform: scale(1);
    }
  }

  .link {
    position: absolute;
    right: 10px;
    top: 10px;
    opacity: 0;
    transform: scale(0.8);
    transition: all $transition-speed ease;
    z-index: 10;
    background: rgba(255, 255, 255, 0.95);
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
    
    i {
      color: $color-primary;
      font-size: 16px;
      transition: transform 0.2s ease;
    }
    
    &:hover i {
      transform: scale(1.2);
    }
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
    .wrap {
      border-color: rgba(71, 0, 241, 0.15);
    }
  }
  
  .wrap {
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid transparent;
    transition: all $transition-speed;
    position: relative;
    overflow: hidden;
  }

  a {
    color: #999;
    transition: color 0.2s;
    &:hover {
      color: $color-primary;
    }
  }

  .title {
    color: $color-primary;
    font-size: 15px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    margin-bottom: 2px;
    letter-spacing: 0.3px;
  }

  i {
    margin-right: 0;
    cursor: pointer;
    color: #999;
    font-size: 14px;
  }

  .desc {
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }

  &__footer {
    border-top: 1px solid #f2f2f2;
    background: #fff;
    padding: 10px 14px;
    text-align: right;
    display: flex;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    margin-top: auto;
    transition: background-color 0.2s;
    
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
        margin-left: 12px;
        padding: 4px 6px;
        border-radius: 30px;
        transition: all 0.2s;
        cursor: pointer;
        
        &:hover {
          background-color: rgba(71, 0, 241, 0.08);
          i {
            transform: scale(1.2);
          }
        }
        
        i {
          transition: transform 0.2s;
          margin-right: 3px;
        }
      }
    }
  }
  &__icon.active {
    &,
    i {
      color: $color-primary;
      font-weight: 500;
    }
  }
}

.info {
  display: block;
  transition: all $transition-speed;
  background: #fff;
  padding: 18px 15px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
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
  min-width: 42px;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  margin-right: 12px;
  object-fit: cover;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
  }
}

@media (max-width: 768px) {
  .website-item {
    .wrap {
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
    }
    
    .info {
      padding: 15px 12px;
    }
    
    .logo {
      min-width: 38px;
      width: 38px;
      height: 38px;
    }
  }
}
</style> 