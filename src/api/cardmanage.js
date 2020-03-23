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
export function requestCardList(data){
	return request({
		url:'/marketing/list_manage/select',
		method:'post',
		data
	})
}

//分配名单
export function distributionPost(data){
	return request({
		url:'/marketing/list_manage/edit_user',
		method:'post',
		data
	})
}
//修改名单名称
export function renameCardPost(data){
	return request({
		url:'/marketing/list_manage/edit_name',
		method:'post',
		data
	})
}

//删除名单
export function delCardPost(data){
	return request({
		url:'/marketing/list_manage/deleteById',
		method:'post',
		data
	})
}
//搜索名单详情页
export function searchGetListDetail(data){//get拼接
	return request({
		url:'/marketing/list_manage/detail/select',
		method:'post',
		data
	})
}

//转移线索
export function transforserClues(data){
	return request({
		url: 'marketing/entbasic/moveClueManager',
		method:'post',
		data
	})
}

export function changeFollowStatus(data){
	return request({
		url:'marketing/list_manage/detail/edit',
		method:'post',
		data
	})
}