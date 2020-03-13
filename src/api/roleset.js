import request from '@/utils/request'
export function loadRoleList(params){
	return request({
		url:'user/api/organize/select',
		method:'get',
		params
	})	
}