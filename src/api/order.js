import request from '@/utils/request'
import qs from 'qs'

export function selectOrder(data) {
  return request({
    url: '/clonemtnet/order/selectOrder',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function cancelOrder(data) {
  return request({
    url: '/clonemtnet/buyer/order/cancel',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function finishOrder(data) {
  return request({
    url: '/clonemtnet/buyer/order/finish',
    method: 'post',
    data: qs.stringify(data)
  })
}