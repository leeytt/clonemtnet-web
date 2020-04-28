import { getQiniuToken } from '@/api/upload'

const actions = {
    // 获取七牛云token
    getQiniuToken({ commit }) {
        return new Promise((resolve, reject) => {
            getQiniuToken().then(response => {
                const { data } = response
                resolve(data)
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