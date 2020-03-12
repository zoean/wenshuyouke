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
  hodeOn:false
}

const mutations = {
  WEBSOCKET_INIT(state, wsUri) {
    //连接之前确保连接已断开
    if (state.websocket != null) {
      state.websocket.close()
      state.websocket = null
    }
    //建立连接
    state.websocket = new WebSocket(wsUri)
    state.websocket.onopen = evt => {      
      console.log('onopen')
    }
    state.websocket.onclose = evt => {
      console.log('onclose')
    }
    state.websocket.onmessage = evt => {
      if(JSON.parse(evt.data).state == 3){
        state.hodeOn = true
      }else{
        state.hodeOn = false
      }
    }
    state.websocket.onerror = evt => {
      console.log('onerror')
    }
  },
  CHECK_IN(state, userInfo) {
    state.checkStatus = 1
    state.sendCheckin = `{"cmd":"1","seatno":"${userInfo.seatId}","telno":"${userInfo.bindTel}","para":"${userInfo.seatPw}"}`
    state.websocket.send(state.sendCheckin) 
  },
  CHECK_OUT(state, userInfo) {
    state.checkStatus = 0
    state.sendCheckout = `{"cmd":"2","seatno":"${userInfo.seatId}","telno":"","para":""}`
    state.websocket.send(state.sendCheckout)
  },
  MAKE_CALL(state, userInfo) {     
    state.sendMakecall = `{"cmd":"3","seatno":"${userInfo.seatId}","telno":"${state.userTel}","para":"1234567890-1234567890-1234567890-1234567890-ABCD"}`
    state.websocket.send(state.sendMakecall)
  },
  DROP_CALL(state,userInfo){
    state.sendDropcall = `{"cmd":"4","seatno":"${userInfo.seatId}","telno":"","para":""}`
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
  }
}

const actions = {
  websocket_init({
    commit
  }) {
    commit('WEBSOCKET_INIT', state.wsUri)
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
