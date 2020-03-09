import request from '@/utils/request'
//获取子帐户
export function getSubAccounts (query) {
  return request({
    url: '/user/api/person/getListByParentId',
    method: 'get',
    params:query
  })
}
//添加名单
export function addCardPost(data){
	return request({
		url:'/marketing/list_manage/add',
		method:'post',
		data
	})	
}
//请求名单列表
export function requestCardList(){
	return request({
		url:'/marketing/list_manage/select',
		method:'get'
	})
}