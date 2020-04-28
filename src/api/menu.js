import request from '@/utils/request'
import qs from 'qs'

export function selectMenuTree() {
  return request({
    url: '/clonemtnet/permission/selectPermissionTree',
    method: 'post'
  })
}

export function updateMenuTree(data) {
  return request({
    url: '/clonemtnet/permission/updatePermissionTree',
    method: 'post',
    data: qs.stringify(data, { indices: false })
  })
}

export function updateMenu(data) {
  return request({
    url: '/clonemtnet/permission/updatePermission',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function addMenu(data) {
  return request({
    url: '/clonemtnet/permission/addPermission',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function removeMenu(params) {
  return request({
    url: '/clonemtnet/permission/removePermission',
    method: 'delete',
    params: params
  })
}
