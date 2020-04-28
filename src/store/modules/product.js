import { getProductById, selectProduct, updateProduct, addProduct, removeProduct } from '@/api/product'

const actions = {
  getProductById({ commit }, params) {
    return new Promise((resolve, reject) => {
      getProductById(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  selectProduct({ commit }, params) {
    return new Promise((resolve, reject) => {
      selectProduct(params).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  
  updateProduct({ commit }, params) {
    return new Promise((resolve, reject) => {
      updateProduct(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addProduct({ commit }, params) {
    return new Promise((resolve, reject) => {
      addProduct(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  removeProduct({ commit }, params) {
    return new Promise((resolve, reject) => {
      removeProduct(params).then(response => {
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

