import {rN} from '@/utils/index'
import {entIdBindCallDetail} from '@/api/orderdetail'
const state = {
  wsUri: 'ws://36.110.48.146:65006/',
  websocket: null,
  sendCheckin: '',
  sendCheckout: '',
  sendMakecall: '',
  sendDropcall:'',
  userTel: '',
  checkStatus: 0,
  callStatus:'',
  hodeOn:false,
  newEntid:'',
  entName:''
}

const mutations = {
  WEBSOCKET_INIT(state, websocket) {
    // 连接之前确保连接已断开
    // if (state.websocket != null) {
    //   state.websocket.close()
    //   state.websocket = null
    // }else{
      state.websocket = websocket
    // }
  },
  CHECK_IN(state, userInfo) {
    state.checkStatus = 1
    state.sendCheckin = `{"cmd":"1","seatno":"${rN(userInfo.seatId)}","telno":"${rN(userInfo.bindTel)}","para":"${userInfo.seatPw}"}`
    state.websocket.send(state.sendCheckin) 
  },
  CHECK_OUT(state, userInfo) {
    state.checkStatus = 0
    state.sendCheckout = `{"cmd":"2","seatno":"${rN(userInfo.seatId)}","telno":"","para":""}`
    state.websocket.send(state.sendCheckout)
  },
  MAKE_CALL(state, userInfo) {
    state.sendMakecall = `{"cmd":"3","seatno":"${rN(userInfo.seatId)}","telno":"${rN(state.userTel+'')}","para":"c=16727741409"}`
    state.websocket.send(state.sendMakecall)
  },
  DROP_CALL(state,userInfo){
    state.sendDropcall = `{"cmd":"4","seatno":"${rN(userInfo.seatId)}","telno":"","para":""}`
    state.websocket.send(state.sendDropcall)
  },
  WEBSOCKET_OUT(state) {
    if (state.websocket != null) {
      state.websocket.close()
      state.websocket = null
    }
  },
  SET_USERTEL(state, userTel) {
    state.userTel = userTel
  },
  HOLD_ON(state, onOff){
    state.hodeOn = onOff
  },
  SET_NEWENTID(state, newEntid){
    state.newEntid = newEntid
  },
  SET_ENTNAME(state, entName){
    state.entName = entName
  }
}

const actions = {
  websocket_init({
    commit,rootGetters
  }, websocket) {
    let connection = new WebSocket('ws://36.110.48.146:65006/')
    commit('WEBSOCKET_INIT', connection)
    connection.onopen = (evt) =>{
      commit('CHECK_IN',rootGetters)//创建链接之后
    }
    connection.onmessage = evt => {
      let wsstate = JSON.parse(evt.data).state
      let para = JSON.parse(evt.data).para
      if(state == 3){
        commit('HOLD_ON', true)
      }else{
        commit('HOLD_ON', false)
      }
      if(wsstate == -2){
        let startIndex = para.indexOf('=')
        let endIndex = para.indexOf(';')
        let cdrid = para.slice(startIndex + 1,endIndex)
        console.log(state)
        entIdBindCallDetail({cdrid, newEntid: state.newEntid, entName:state.entName}).then(response => {
          console.log(response)
        })
      }
    }
  },
  check_in({
    commit,
    rootGetters
  }) {
    commit('CHECK_IN', rootGetters)
  },
  check_out({
    commit,
    rootGetters
  }) {
    commit('CHECK_OUT', rootGetters)
  },
  make_call({
    commit,
    rootGetters
  }) {
    commit('MAKE_CALL', rootGetters)
  },
  drop_call({
    commit,rootGetters
  }){
    commit('DROP_CALL',rootGetters)
  },
  websocket_out({
    commit
  }) {
    commit('WEBSOCKET_OUT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
