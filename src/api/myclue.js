import request from '@/utils/request'
// 线索查询
export function mycluesearch (data) {
  return request({
    url: '/marketing/myclue/select',
    method: 'post',
    data
  })
}
//线索批量删除
export function mycluedel (data) {
  return request({
    url: '/marketing/myclue/deleteByIds',
    method: 'post',
    data
  })
}
//线索批量转移
export function myclueedit (data) {
  return request({
    url: '/marketing/myclue/editByIds',
    method: 'post',
    data
  })
}
//线索详情查询
export function cluedetail (data) {
  return request({
    url: '/marketing/myclue/detail/select',
    method: 'post',
    data
  })
}

//线索详情上一条查询
export function cluelast (data) {
  return request({
    url: '/marketing/myclue/detail/select_last',
    method: 'post',
    data
  })
}

//线索详情下一条查询
export function cluenext (data) {
  return request({
    url: '/marketing/myclue/detail/select_next',
    method: 'post',
    data
  })
}

//线索详情编辑
export function clueedit (data) {
  return request({
    url: '/marketing/myclue/detail/edit',
    method: 'post',
    data
  })
}

//线索详情删除
export function cluedel (data) {
  return request({
    url: '/marketing/myclue/detail/delete',
    method: 'post',
    data
  })
}

//线索详情转移
export function cluetransfer (data) {
  return request({
    url: '/marketing/myclue/detail/transfer',
    method: 'post',
    data
  })
}

//线索详情跟进查询
export function cluefollowselect (data) {
  return request({
    url: '/marketing/myclue/detail/select_follow',
    method: 'post',
    data
  })
}

//线索详情跟进添加
export function cluefollowadd (data) {
  return request({
    url: '/marketing/myclue/detail/add_follow',
    method: 'post',
    data
  })
}
