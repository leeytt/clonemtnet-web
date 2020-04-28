import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 请求的url = base url + request url
  timeout: 15000 // 请求超时
  // withCredentials: true, // 当跨域请求时发送cookie
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 让每个请求携带token
      // ['token']是一个自定义头键
      // 请根据实际情况修改
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获得http信息，如头信息或状态信息
   * 请返回response
  */
  response => {
    const res = response.data
    // 如果自定义代码不是200，则判断为错误。
    if (res.code === 200) {
      return res
    } else {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      // 20010: 非法token; 20011: token过期;
      if (res.code === 20010 || res.code === 20011) {
        // 重新登陆
        MessageBox.confirm('您已经登出，您可以取消以停留在此页面，或再次登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // 401: 未登录，请先登录
      if (res.code === 401) {
        Message({
          message: res.msg,
          type: 'warning',
          duration: 3 * 1000
        })
        return Promise.reject(res)
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
