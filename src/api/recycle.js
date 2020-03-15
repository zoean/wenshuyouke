import request from '@/utils/request'
// 回收站线索查询
export function recycleSelect (data) {
  return request({
    url: '/marketing/recycle/select',
    method: 'post',
    data
  })
}

//回收站线索批量转移
export function recycleEdit (data) {
  return request({
    url: '/marketing/recycle/editByIds',
    method: 'post',
    data
  })
}

//回收站名单列表查询
export function listList (data) {
  return request({
    url: '/marketing/list_manage/select_list',
    method: 'post',
    data
  })
}
