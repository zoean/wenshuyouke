import request from '@/utils/request'
export function loadRoleList(data){
	return request({
		url:'user/api/role/select',
		method:'post',
		data
	})	
}

export function addRole(data){
	return request({
		url:'user/api/role/add',
		method:'post',
		data
	})
}
export function editRole(data){
	return request({
		url:'user/api/role/update',
		method:'post',
		data
	})
}
export function delRole(data){
	return request({
		url:'user/api/role/delete',
		method:'post',
		data
	})
}

export function getRoleTree(data){
	return request({
		url:'user/api/menu/select',
		method:'post',
		data
	})
}

export function setRoleTree(data){
	return request({
		url: 'user/api/menu/bind',
		method:'post',
		data
	})
}