import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// u9875u9762u7ec4u4ef6
import Home from '../views/Home.vue'
import Recommend from '../views/Recommend.vue'
import NavDetail from '../views/NavDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/nav/:id',
    name: 'NavDetail',
    component: NavDetail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router 