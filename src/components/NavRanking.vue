<template>
  <router-link :to="`/nav/${data._id}`" class="nav-ranking">
    <el-image class="logo" :src="data.logo" />
    <span class="name">{{ data.name }}</span>
    <span class="widget"> {{ formatAttr(data[countType]) }}</span>
    <span class="el-icon-view" v-if="countType == 'view'"></span>
    <span class="el-icon-star-off" v-if="countType == 'star'"></span>
  </router-link>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "NavRanking",
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    countType: {
      type: String,
      default: 'createTime'
    }
  },
  methods: {
    formatAttr(value) {
      if (this.countType === 'createTime') {
        return dayjs(value).format('YYYY-MM-DD')
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-ranking {
  align-items: center;
  color: #333;
  display: flex;
  margin-bottom: 20px;
  cursor: pointer;
  .logo {
    min-width: 20px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .name {
    flex: 1;
    font-weight: 500;
    font-size: 14px;
  }
  i {
    margin-left: 4px;
  }
  &:hover {
    .name {
      color: #4700f1;
    }
  }
}
</style> 