import {
  companysearch,
  searchinfo,
  category,
  industry,
  area,
  addClueManager
} from '@/api/companysearch'

import {
  getToken,
  setToken,
  removeToken,
  getLocal
} from '@/utils/auth'
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage
} from '@/utils/index'
import router, {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: '',
    name: '',
    avatar: '',
    userId: '',
    roles: [],
    seatId: '8001',
    seatPw: '1234',
    bindTel: '8001'    
  }
}

const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SEATID: (state, seatId) => {
    state.seatId = seatId
  },
  SET_SEATPW: (state, seatPw) => {
    state.seatPw = seatPw
  },
  SET_BINDTEL: (state, bindTel) => {
    state.bindTel = bindTel
  }
}
const actions = {
  companysearch({
    commit
  },keysData) {
    return new Promise((resolve, reject) => {
      companysearch(keysData).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  searchinfo({
    commit
  },infosdata) {
    return new Promise((resolve, reject) => {
      searchinfo(infosdata).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  category({
    commit
  },categoryid) {
    return new Promise((resolve, reject) => {
      category(categoryid).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  industry({
    commit
  },industryid) {
    return new Promise((resolve, reject) => {
      industry(industryid).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  area({
    commit
  },pid) {
    return new Promise((resolve, reject) => {
      area(pid).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addClueManager({
    commit
  },entlist) {
    return new Promise((resolve, reject) => {
      addClueManager(entlist).then(response => {
        console.log(entlist)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
