import request from '@/utils/request'
// 新企推荐列表请求
export function requestNewComList(data){
	return request({
		url: 'marketing/entbasic/list',
		method:'post',
		data
	})
}
// 新企推荐-获取当前帐户的名单用于分配新企数据(不带分页用于下拉选择)
export function getCurUserCard(data){
	return request({
		url:'marketing/list_manage/select_list',
		method:'post',
		data
	})
}
// 新企推荐-领取到名单
export function getNewComToCard(data){
	return request({
		url: 'marketing/entbasic/addClueManager',
		method:'post',
		data
	})
}