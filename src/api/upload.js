import request from '@/utils/request'
import qs from 'qs'

export function getQiniuToken() {
  return request({
    url: '/clonemtnet/upload/getQiniuToken',
    method: 'get'
  })
}