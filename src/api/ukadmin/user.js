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