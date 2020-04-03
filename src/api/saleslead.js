import request from '@/utils/request'
// 销售商机模块api
//获取线索列表
export function getCluesList(data){
	return request({
		url: 'marketing/business/getbusiness',
		method:'post',
		data
	})
}
//转移线索给自己
export function postCluesToSelf(data){
	return request({
		url:'marketing/business/removeclue',
		method:'post',
		data
	})
}

//更新线索
export function updateClues(data){
	return request({
		url:'marketing/business/updateBusinessInfo',
		method:'post',
		data
	})
}

//呼叫挂断
export function dropCallPost(data){
	return request({
		url:'marketing/business/updateCallDetail',
		method:'post',
		data
	})
}

//发送坐席和线索号码
export function getxPhoneNums(data){
	return request({
		url:'marketing/business/ax/xnumber',
		method:'post',
		data
	})
}

//虚拟号解绑
export function unbindXphone(data){
	return request({
			url: data ? `marketing/business/ax/unBind/${data}` : 'marketing/business/ax/unBind/1',
		method: 'delete'
	})
}