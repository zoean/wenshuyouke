import request from '@/utils/request'

export function userLogin(data) {
  return request({
    url: '/user/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo(userId) {
  return request({
    url: '/user/api/person/getDataById',
    method: 'get',
    userId
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
