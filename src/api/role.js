import request from '@/utils/request'
import qs from 'qs'

export function getAll() {
  return request({
    url: '/clonemtnet/role/getAll',
    method: 'get'
  })
}

export function selectRole(data) {
  return request({
    url: '/clonemtnet/role/selectRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateRole(data) {
  return request({
    url: '/clonemtnet/role/updateRole',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function addRole(data) {
  return request({
    url: '/clonemtnet/role/addRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function removeRole(params) {
  return request({
    url: '/clonemtnet/role/removeRole',
    method: 'delete',
    params: params
  })
}
