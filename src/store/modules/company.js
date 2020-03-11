import {
  editcompany
} from '@/api/company'

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

  company({
    commit
  },editcompanyInfo) {
    const {
      id,
      enterpriseScale,
      enterpeiseWebsite,
      enterpriseContact,
      enterpriseBusiness,
      enterpriseDesc
    }=editcompanyInfo
    return new Promise((resolve, reject) => {
      editcompany({
        id:id,
        enterpriseScale:enterpriseScale,
        enterpeiseWebsite:enterpeiseWebsite,
        enterpriseContact:enterpriseContact,
        enterpriseBusiness:enterpriseBusiness,
        enterpriseDesc:enterpriseDesc
      }).then(response => {
		  console.log(editcompanyInfo)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
