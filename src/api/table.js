import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/clonemtnet-web/table/list',
    method: 'get',
    params
  })
}
