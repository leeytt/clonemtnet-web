import request from '@/utils/request'
import qs from 'qs'

export function getProductById(data) {
  return request({
    url: '/clonemtnet/procuteInfo/getProductInfo',
    method: 'get',
    data: qs.stringify(data)
  })
}

export function selectProduct(data) {
  return request({
    url: '/clonemtnet/procuteInfo/selectProductInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateProduct(data) {
  return request({
    url: '/clonemtnet/procuteInfo/updateProductInfo',
    method: 'put',
    data: qs.stringify(data)
  })
}

export function addProduct(data) {
  return request({
    url: '/clonemtnet/procuteInfo/addProductInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function removeProduct(params) {
  return request({
    url: '/clonemtnet/procuteInfo/removeProductInfo',
    method: 'delete',
    params: params
  })
}
