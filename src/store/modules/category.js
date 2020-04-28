import { getAll, updateCategory, addCategory, removeCategory } from '@/api/category'

const actions = {
  getAll({ commit }) {
    return new Promise((resolve, reject) => {
        getAll().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  
  updateCategory({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateCategory(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addCategory({ commit }, params) {
    return new Promise((resolve, reject) => {
      addCategory(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  removeCategory({ commit }, params) {
    return new Promise((resolve, reject) => {
      removeCategory(params).then(response => {
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

