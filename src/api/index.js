import axios from 'axios'

// API请求实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000*6
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在生产环境中，确保URL路径正确
    if (process.env.NODE_ENV === 'production') {
      // 移除URL中多余的/api前缀（如果API路径已经包含了）
      if (config.url.startsWith('/api/') && config.baseURL.endsWith('navapi.lmyself.top')) {
        config.url = config.url.replace(/^\/api/, '');
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 添加跨域错误处理
    if (error.response && error.response.status === 0) {
      console.error('可能存在跨域问题，请检查API服务器是否允许跨域请求');
    }
    return Promise.reject(error)
  }
)

// function objToQuery(obj) {
//   if (!obj) return ''

//   const query = `?`
//   const queryArr = []
//   for (let i in obj) {
//     queryArr.push(`${i}=${obj[i]}`)
//   }

//   return query + queryArr.join('&')
// }

export const API_NAV = '/api/nav'
export const API_NAV_REPTILE = '/api/nav/reptile'
export const API_NAV_RANDOM = '/api/nav/random'
export const API_NAV_RANKING = '/api/nav/ranking'
export const API_NAV_FIND = '/api/nav/find'
export const API_CATEGORY_LIST = '/api/category/list'
export const API_TAG_LIST = '/api/tag/list'

const api = {
  addNav(data) {
    return instance.post('/api/nav', data)
  },
  editNav(data) {
    return instance.put('/api/nav', data)
  },
  findNav(id) {
    return instance.get(`/api/nav/find?categoryId=${id}`)
  },
  getCategoryList() {
    return instance.get('/api/category/list')
  },
  getNavRanking() {
    return instance.get('/api/nav/ranking')
  },
  getTagList() {
    return instance.get('/api/tag/list')
  },
  getNavReptile(url) {
    return instance.get(`/api/nav/reptile?url=${encodeURIComponent(url)}`)
  },
  getNavDetail(id) {
    return instance.get(`/api/nav?id=${id}`)
  },
  getRandomNavList() {
    return instance.get('/api/nav/random')
  },
  updateNavStar(id) {
    return instance.put(`/api/nav/star`, { id })
  },
  updateNavView(id) {
    return instance.put(`/api/nav/view`, { id })
  }
}

export default api 