import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie获取token 验权
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login', '/404'] // 白名单，不需要登录即可访问的路由

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()
  if (hasToken) {
    // if (to.path === '/login') {
    //   // 如果已登录，则重定向到主页
    //   next({ path: '/' })
    //   NProgress.done()
    // } else {
    //   const hasGetUserInfo = store.getters.role
    //   if (hasGetUserInfo) {
    //     next()
    //   } else {
    //     try {
    //       // 获取用户信息
    //       await store.dispatch('user/getUserInfo')
    //       next()
    //     } catch (error) {
    //       // 删除token，进入登录页面重新登录
    //       await store.dispatch('user/resetToken')// 删除令牌
    //       Message.error(error || 'Has Error')
    //       next(`/login?redirect=${to.path}`)
    //       NProgress.done()
    //     }
    //   }
    // }

    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done() // 结束Progress
    } else if (!store.getters.role) {
      try {
        // 获取用户信息
        await store.dispatch('user/getUserInfo')
        // next()
        // store.dispatch('user/getUserInfo').then(() => {
          next({ ...to })
        // })
      } catch (error) {
        // 删除token，进入登录页面重新登录
        await store.dispatch('user/resetToken')// 删除令牌
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    } else {
      next()
    }
  } else {
    /* 没有token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单，直接去
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
