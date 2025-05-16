<template>
  <div class="app-search">
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="queryData"
      :placeholder="placeholder"
      @select="handleSelect"
      suffix-icon="el-icon-search"
    >
      <template v-slot:prepend>
        <el-select v-model="searchType" class="search-type-box">
          <el-option label="站内" value="station"></el-option>
          <el-option label="百度" value="baidu"></el-option>
          <el-option label="谷歌" value="google"></el-option>
          <el-option label="360" value="360"></el-option>
          <el-option label="必应" value="bing"></el-option>
          <el-option label="搜狗" value="sogou"></el-option>
        </el-select>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import axios from "axios";

const searchGather = {
  station: {
    name: '站内',
    placeholder: '站内搜索'
  },
  baidu: {
    name: '百度',
    placeholder: '百度搜索',
    root: 'https://www.baidu.com/s?wd='
  },
  google: {
    name: '谷歌',
    placeholder: '谷歌搜索',
    root: 'https://www.google.com.hk/search?q='
  },
  '360': {
    name: '360',
    placeholder: '360搜索',
    root: 'https://www.so.com/s?q='
  },
  'bing': {
    name: '必应',
    placeholder: '必应搜索',
    root: 'https://cn.bing.com/search?q='
  },
  'sogou': {
    name: '搜狗',
    placeholder: '搜狗搜索',
    root: 'https://www.sogou.com/web?query='
  },
}

export default {
  name: "AppSearch",
  props: {

  },
  data() {
    return {
      restaurants: [],
      state: '',
      searchType: 'station',
      timeout: null
    }
  },
  computed: {
    placeholder() {
      return searchGather[this.searchType]['placeholder']
    }
  },
  methods: {
    queryData(query, cb) {
      if (this.searchType === 'station') {
        this.queryStation(query, cb)
      } else {
        this.queryBaidu(query, cb)
      }
    },
    async queryStation(query, cb) {
      if (query !== '') {
        try {
          const response = await axios.get(`/api/nav?keyword=${query}`)
          const data = response.data
          if (data && Array.isArray(data.data)) {
            const finalData = data.data.map(item => {item.value = item.name; return item})
            cb(finalData)
          } else {
            cb([])
          }
        } catch (error) {
          console.error(error)
          cb([])
        }
      } else {
        cb([])
      }
    },
    async queryBaidu(query, cb) {
      try {
        const res = await axios.get(`https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?&wd=${query}&cb=getJSONPData`)
        if (res.data) {
          const data = eval(res.data)
          if (data && data.s) {
            const finalData = data.s.reduce((t, v) => [...t, {value: v}], [])
            cb(finalData)
          } else {
            cb([])
          }
        } else {
          cb([])
        }
      } catch (e) {
        console.error(e)
        cb([])
      }
    },

    handleSelect(item) {
      let url = ''
      if (this.searchType === 'station') {
        if (item && item._id) {
          this.$router.push(`/nav/${item._id}`)
        }
      } else {
        url = searchGather[this.searchType].root + item.value
        window.open(url)
      }
    },
  },

  mounted() {
    window.getJSONPData = function (data) {
      return data;
    }
  }
}
</script>

<style lang="scss" scoped>
.app-search {
  display: flex;
  justify-content: center;

  .el-select {
    width: 300px;
    border-right: 1px solid #eee;
  }

  :deep(.el-input-group__append), :deep(.el-input-group__prepend) {
    border: 0;
  }

  :deep(.el-input__inner) {
    border: 0;
    box-shadow: none;
    background: #f5f7fa;
  }

  .search-type-box {
    width: 80px;
  }

  :deep(.el-select .el-input.is-focus .el-input__inner) {
    border-color: #dfe1e5;
    box-shadow: 0 0 20px rgba(0, 0, 0, .1);
  }
}

@media screen and (max-width: 568px) {
  .app-search {
      display: none;
  }
}

@media screen and (min-width: 569px) {
  .app-search {
      display: block;
  }
}
</style> 