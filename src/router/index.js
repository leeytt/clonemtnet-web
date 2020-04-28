import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 布局 */
import Layout from '@/layout'

/**
 * 注意:子菜单只在路由子菜单时出现. 长度 >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为真，项目将不会显示在侧栏(默认为假)
 * alwaysShow: true               如果设置为真，将始终显示根菜单
 *                                如果不设置alwaysShow，当项目有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect将不会在面包屑中重定向
 * name:'router-name'             路由名称(必须设置!!)
 * meta : {
    roles: ['admin','editor']    控制页面角色(您可以设置多个角色)
    title: 'title'               名称显示在侧栏和面包屑(推荐设置)
    icon: 'svg-name'             图标显示在侧栏中
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中(默认为true)
    activeMenu: '/example/list'  如果设置路径，侧栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基页
 * 所有角色都可以访问
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'center',
      name: 'Center',
      component: () => import('@/views/center'),
      meta: { title: '个人中心' },
      hidden: true
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'system' },
    menu: 'system',
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user'),
        meta: { title: '用户管理', icon: 'user' },
        menu: 'user'
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'role' },
        menu: 'role'
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu'),
        meta: { title: '菜单管理', icon: 'menu' },
        menu: 'menu'
      }
    ]
  },

  {
    path: '/sell',
    component: Layout,
    redirect: '/sell/product',
    name: 'Sell',
    meta: { title: '微信订餐', icon: 'sell' },
    menu: 'sell',
    children: [
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/sell/product'),
        meta: { title: '商品管理', icon: 'product' },
        menu: 'product'
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/sell/order'),
        meta: { title: '订单管理', icon: 'form' },
        menu: 'order'
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/sell/category'),
        meta: { title: '商品类目', icon: 'category' },
        menu: 'category'
      }
    ]
  },

  {
    path: 'apidoc',
    component: Layout,
    menu: 'apidoc',
    children: [
      {
        path: 'http://127.0.0.1:8080/clonemtnet/doc.html',
        meta: { title: '接口文档', icon: 'example' },
        menu: 'apidoc'
      }
    ]
  },

  // 404 页面必须放在最后!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router
