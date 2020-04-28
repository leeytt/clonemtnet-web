import { selectOrder, cancelOrder, finishOrder } from '@/api/order'

const actions = {
  selectOrder({ commit }, params) {
    return new Promise((resolve, reject) => {
      selectOrder(params).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  cancelOrder({ commit }, params) {
    return new Promise((resolve, reject) => {
      cancelOrder(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  finishOrder({ commit }, params) {
    return new Promise((resolve, reject) => {
      finishOrder(params).then(response => {
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

