import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    category: [],
    seletedMenuParentId: '',
    seletedMenuId: '',
  },

  getters: {

  },

  mutations: {
    saveCategory(state, payload) {
      localStorage.setItem('category', JSON.stringify(payload))
      state.category = payload
    },
    saveSeletedId(state, payload) {
      state.seletedMenuParentId = payload && payload.parentId;
      state.seletedMenuId = payload && payload.id;
    }
  },

  actions: {
  }
}); 