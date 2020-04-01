import request from '@/utils/request'
export function getCallList(data){
	return request({
		url: 'call/calldetail/select',
		method:'post',
		data
	})
}
// 企业ID绑定话单
export function entIdBindCallDetail(data){
	return request({
		url: 'call/cdrbind/add',
		method: 'post',
		data
	})
}