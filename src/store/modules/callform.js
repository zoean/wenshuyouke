const state = {
	curCluesVisible: false, // 弹窗
  callPanelVisible: false,// 通话计时
  curCluesForm:{},// 当前线索信息
  countTime:'正在呼叫中...',// 通话计时
  editType: ''//edit-只编辑不打电话 call打电话
}

const mutations = {
  TOGGLE_CLUEFORM: state => {//表单弹窗
    state.curCluesVisible = !state.curCluesVisible
  },
  TOGGLE_PANEL: (state) => {//通话计时框
    state.callPanelVisible = !state.callPanelVisible
  },
  SET_CURCLUEFORM:(state, formInfo) => {
  	state.curCluesForm = formInfo
  },
  CHANGE_EDITTYPE:(state, type) => {
    state.editType = type
  }
}

const actions = {
  toggleClueForm({
    commit
  }) {
    commit('TOGGLE_CLUEFORM')
  },
  togglePanel({
    commit
  }) {
    commit('TOGGLE_PANEL')
  },
  setCurClueForm({commit}, formInfo){
  	commit('SET_CURCLUEFORM', formInfo)
  },
  setEditType({commit}, type){
    commit('CHANGE_EDITTYPE', type)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
