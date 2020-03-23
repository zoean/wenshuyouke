import request from '@/utils/request'
//获取子帐户
export function getEntUserList (data) {
  return request({
    url: 'user/api/person/select',
    method: 'post',
    data
  })
}
//添加企业用户
export function addEntUser(data){
	return request({
		url: '/user/api/person/add',
		method:'post',
		data
	})
}

//编辑企业用户
export function updateEntUser(data){
	return request({
		url: '/user/api/person/update',
		method:'post',
		data
	})
}

//删除企业用户
export function delEntUser(data){
	return request({
		url: '/user/api/person/delete',
		method:'post',
		data
	})
}
//企业用户重置密码
export function resetEntUserPassWord(data){
	return request({
		url: 'user/api/person/reset',
		method:'post',
		data
	})
}