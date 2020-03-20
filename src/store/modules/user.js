import {
  userLogin,
  logout,
  getInfo,
  getUserInfo
} from '@/api/user'
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
    seatId: '6002',
    seatPw: '1234',
    bindTel: '6002'
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
  // user login
  login ({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      userLogin({
        userName: username.trim(),
        passWord: password
      }).then(response => {
        const {
          obj
        } = response.data
        commit('SET_TOKEN', obj.token)
        commit('SET_USERID', obj.userId)
        setToken(obj.token)
        setLocalStorage('userId',obj.userId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const {
          obj
        } = response.data
        if (response.status !== 200) {
          removeToken()
          removeLocalStorage('userId')          
          removeLocalStorage('userName')
          removeLocalStorage('enterpriseName')
          router.push(`/login`)
        }
        if (!obj) {
          reject('Verification failed, please Login again.')
        }

        const {
          realName,
          userIcon,
          roleType
        } = obj
        if (obj.seatId) {
          commit('SET_SEATID', obj.seatId)
        }
        if (obj.seatPw) {
          commit('SET_SEATPW', obj.seatPw)
        }
        if (obj.bindTel) {
          commit('SET_BINDTEL', obj.bindTel)
        }
        if(obj.enterprise && obj.enterprise.enterpriseName){
          setLocalStorage('enterpriseName',obj.enterprise.enterpriseName)
        }
        commit('SET_NAME', realName)
        commit('SET_AVATAR', userIcon)
        commit('SET_ROLES', roleType)
        resolve(obj)//await的函数需要返回一个Promise 当resolve被触发时代表本次异步过程结束
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({
    commit
  }) {
    return new Promise((resolve, reject)=>{
      removeToken() // must remove  token  first    
      removeLocalStorage('userId')    
      removeLocalStorage('userName')
      removeLocalStorage('enterpriseName')      
      commit('SET_ROLES', [])
      commit('RESET_STATE')
      resetRouter()
      resolve()
    })
    
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken ({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeLocalStorage('userId')      
      removeLocalStorage('userName')      
      removeLocalStorage('enterpriseName')
      commit('RESET_STATE')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles ({
    commit,
    dispatch
  }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {
        roles
      } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {
        root: true
      })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
