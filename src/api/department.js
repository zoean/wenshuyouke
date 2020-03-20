import request from '@/utils/request'
// 请求组织架构tree
export function getOrganize (params) {
  return request({
    url: 'user/api/organize/select',
    method: 'get',
    params
  })
}
//添加部门
export function addOrganize (data) {
  return request({
    url: 'user/api/organize/add',
    method: 'post',
    data
  })
}
//删除部门
export function delOrganize (data) {
  return request({
    url: 'user/api/organize/delete',
    method: 'post',
    data
  })
}
//编辑部门
export function editOrganize (data) {
  return request({
    url: 'user/api/organize/update',
    method: 'post',
    data
  })
}

//请求用户列表
export function getWorkerList(data){
	return request({
		url:'user/api/person/select',
		method:'post',
		data
	})
}

//添加用户
export function addWorker(data){
	return request({
		url:'user/api/person/add',
		method:'post',
		data
	})
}
//编辑用户
export function editWorker(data){
  return request({
    url:'user/api/person/update',
    method:'post',
    data
  })
}

//删除用户
export function delWorker(data){
	return request({
		url:'user/api/person/delete',
		method:'post',
		data
	})
}