import request from '@/utils/request'
//线索明细
export function cluedetails (data) {
  return request({
    url: 'marketing/receivelog/list',
    method: 'post',
    data
  })
}