import { getAll, selectRole, updateRole, addRole, removeRole } from '@/api/role'

const actions = {
  // 获取所有角色
  getAll({ commit }) {
    return new Promise((resolve, reject) => {
        getAll().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 动态查询角色
  selectRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      selectRole(params).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  
  // 动态更新角色
  updateRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateRole(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 添加角色
  addRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      addRole(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除角色
  removeRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      removeRole(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}

