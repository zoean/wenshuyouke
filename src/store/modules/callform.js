import { unbindXphone } from '@/api/saleslead'
const state = {
	curCluesVisible: false, // 弹窗
  callPanelVisible: false,// 通话计时
  fetchXphoneVisible: false,
  curCluesForm:{},// 当前线索信息
  countTime:'正在呼叫中...',// 通话计时
  editType: '',//edit-只编辑不打电话 call打电话
  xphone:'',
  xphoneId: ''
}

const mutations = {
  TOGGLE_CLUEFORM: state => {//表单弹窗
    state.curCluesVisible = !state.curCluesVisible
  },
  TOGGLE_PANEL: (state) => {//通话计时框
    state.callPanelVisible = !state.callPanelVisible
  },
  TOGGLE_XPHONE: (state) => {
    state.fetchXphoneVisible = !state.fetchXphoneVisible
  },
  SET_CURCLUEFORM:(state, formInfo) => {
  	state.curCluesForm = formInfo
  },
  CHANGE_EDITTYPE:(state, type) => {
    state.editType = type
  },
  SET_XPHONE:(state, xphone) => {
    state.xphone = xphone
  },
  SET_XPHONEID: (state, xphoneid) => {
    state.xphoneid = xphoneid
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
  },
  unbindXphone(){
    unbindXphone(state.xphoneid).then(response => {
      console.log(response)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
