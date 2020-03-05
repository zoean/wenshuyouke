import request from '@/utils/request'

export function userLogin (data) {
  return request({
    url: '/user/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo () {
  return request({
    url: '/user/api/person/getDataById',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getVcode () {
  return request({
    url: '/user/auth/getCode',
    method: 'get'
  })
}
