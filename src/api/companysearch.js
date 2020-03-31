import request from '@/utils/request'

export function companysearch (data) {
  return request({
    url: 'marketing/entbasic/oldlist',
    method: 'post',
    data
  })
}

export function searchinfo (data) {
  return request({
    url: 'marketing/entbasic/get',
    method: 'post',
    data
  })
}

export function category (data) {
  return request({
    url: 'marketing/industry/fora',
    method: 'post',
    data
  })
}

export function industry (data) {
  return request({
    url: 'marketing/industry/forb',
    method: 'post',
    data
  })
}

export function area (data) {
  return request({
    url: 'marketing/area/getArea',
    method: 'post',
    data
  })
}

export function addClueManager (data) {
  return request({
    url: 'marketing/entbasic/addClueManager',
    method: 'post',
    data
  })
}
