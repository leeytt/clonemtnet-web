import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'
import role from './modules/role'
import menu from './modules/menu'
import category from './modules/category'
import product from './modules/product'
import order from './modules/order'
import upload from './modules/upload'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    role,
    menu,
    category,
    product,
    order,
    upload
  },
  getters
})

export default store
