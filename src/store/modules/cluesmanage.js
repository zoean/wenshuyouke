//发现线索全局状态
const state = {
	curCardId:''
}
const mutations = {
	SET_CURCARDID(state, curCardId){
		state.curCardId = curCardId
	}
}
const actions = {

}
export default{
	namespaced:true,
  state,
  mutations,
  actions
}