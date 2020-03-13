import request from '@/utils/request'
export function getCallList(data){
	return request({
		url: 'call/calldetail/select',
		method:'post',
		data
	})
}