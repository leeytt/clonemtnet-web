import Vue from 'vue'

import 'normalize.css/normalize.css' // 一个现代的替代CSS重置

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局自定义的css样式

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限控制
import { hasPermission } from "./utils/hasPermission";

/**
 * 如果您不想使用模拟服务器
 * 您希望使用MockJs作为模拟api
 * 您可以执行:mockXHR()
 *
 * 目前MockJs将在生产环境中使用，
 * 请在上线前删除它!!!
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

//全局的常量 用于按钮级别的权限控制
Vue.prototype.hasPerm = hasPermission

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
