import request from '@/utils/request'
import qs from 'qs'

export function getAll() {
  return request({
    url: '/clonemtnet/category/getAll',
    method: 'get'
  })
}

export function updateCategory(data) {
  return request({
    url: '/clonemtnet/category/updateCategory',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function addCategory(data) {
  return request({
    url: '/clonemtnet/category/addCategory',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function removeCategory(params) {
  return request({
    url: '/clonemtnet/category/removeCategory',
    method: 'delete',
    params: params
  })
}
