import request from '@/utils/request'

export function userLogin(data) {
  return request({
    url: '/user/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo(params) {
  return request({
    url: '/user/api/person/getDataById',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
