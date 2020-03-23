import request from '@/utils/request'
//线索明细
export function accountoverview (data) {
  return request({
    url: '/receivelog/list',
    method: 'post',
    data
  })
}