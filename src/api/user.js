import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/clonemtnet/userAuth/auth',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getUserInfo() {
  return request({
    url: '/clonemtnet/userAuth/getUserInfo',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/clonemtnet/userAuth/logout',
    method: 'post'
  })
}

export function selectUser(data) {
  return request({
    url: '/clonemtnet/user/selectUser',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateUser(data) {
  return request({
    url: '/clonemtnet/user/updateUser',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function addUser(data) {
  return request({
    url: '/clonemtnet/user/addUser',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function removeUser(params) {
  return request({
    url: '/clonemtnet/user/removeUser',
    method: 'delete',
    params: params
  })
}

export function getUser(data) {
  return request({
    url: '/clonemtnet/user/getUser',
    method: 'get',
    params: data
  })
}
