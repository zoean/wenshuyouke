import request from '@/utils/request'

export function editcompany (data) {
  return request({
    url: '/user/api/enterprise/update',
    method: 'post',
    data
  })
}
