import { login, logout, getUserInfo, selectUser, updateUser, addUser, removeUser, getUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '@/store'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    roleName: '',
    nickname: "",
    userId: "",
    avatar: '',
    role: '',
    menus: [],
    permissions: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ROLENAME: (state, roleName) => {
    state.roleName = roleName
  },

  SET_USER: (state, userInfo) => {
    state.nickname = userInfo.nickname;
    state.userId = userInfo.userId;
    state.avatar = userInfo.headImgUrl;
    state.role = userInfo.roleName;
    state.menus = userInfo.menuList;
    state.permissions = userInfo.permissionList;
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if (response.code === 200) {
          const { data } = response
          // cookie中保存前端登录状态
          commit('SET_TOKEN', data.token)
          setToken(data.token)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { username, roleName } = data.userInfo
        commit('SET_USERNAME', username)
        commit('SET_ROLENAME', roleName)

        //储存用户信息
        commit('SET_USER', data.userInfo);
        //生成路由
        let userPermission = data.userInfo ;
        store.dispatch('permission/GenerateRoutes', userPermission).then(() => {
          //生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
          router.addRoutes(store.getters.addRouters)
        })
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // 必须先删除token
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除令牌
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先删除token
      commit('RESET_STATE')
      resolve()
    })
  },

  // 动态查询用户
  selectUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      selectUser(params).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 动态更新用户
  updateUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateUser(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 添加用户
  addUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      addUser(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除用户
  removeUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      removeUser(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 根据userId查询用户
  getUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      getUser(params).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

