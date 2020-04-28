import { selectMenuTree, updateMenu, addMenu, removeMenu, updateMenuTree } from '@/api/menu'

const actions = {
  // 获取菜单树
  selectMenuTree({ commit }) {
    return new Promise((resolve, reject) => {
      selectMenuTree().then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 保存菜单树
  updateMenuTree({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateMenuTree(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 动态更新菜单
  updateMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateMenu(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 添加菜单
  addMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      addMenu(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除菜单
  removeMenu({ commit }, params) {
    return new Promise((resolve, reject) => {
      removeMenu(params).then(response => {
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