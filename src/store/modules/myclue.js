import {
  mycluesearch,// 线索查询
  mycluedel,//线索批量删除
  myclueedit,//线索批量转移
  cluedetail,//线索详情查询
  cluelast,//线索详情上一条查询
  cluenext,//线索详情下一条查询
  clueedit,//线索详情编辑
  cluedel,//线索详情删除
  cluetransfer,//线索详情转移
  cluefollowselect,//线索详情跟进查询
  cluefollowadd//线索详情跟进添加
} from '@/api/myclue'

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
  },
  SET_COMPANYID(state, companyId){
		state.companyId = companyId
	}
}
const actions = {
  cluessearch({
    commit
  },tableData){
    return new Promise((resolve, reject) => {
      mycluesearch(tableData).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  cluesdel({
    commit
  },delclueinfo) {
    const {
      ids
    }=delclueinfo
    return new Promise((resolve, reject) => {
      mycluedel({
        ids:ids
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  cluesedit({
    commit
  },editclueinfo) {
    const {
      ids,
      listId
    }=editclueinfo
    return new Promise((resolve, reject) => {
      myclueedit({
        ids:ids,
        listId:listId
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  cluesdetail({
    commit
  },cluesinfo) {
    const {
      id,
    }=cluesinfo
    return new Promise((resolve, reject) => {
      cluedetail({
        id:id,
      }).then(response => {
        // console.log(1111)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  clueslast({
    commit
  },lastinfo) {
    return new Promise((resolve, reject) => {
      cluelast(lastinfo).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  cluesnext({
    commit
  },nextinfo) {
    return new Promise((resolve, reject) => {
      cluenext(nextinfo).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  cluedel({
    commit
  },delinfo) {
    const {
      id,
    }=delinfo
    return new Promise((resolve, reject) => {
      cluedel({
        id:id,
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  clueedit({
    commit
  },editcont) {
    return new Promise((resolve, reject) => {
      clueedit(editcont).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  cluetransfer({
    commit
  },transferinfo) {
    const {
      id,
    }=transferinfo
    return new Promise((resolve, reject) => {
      cluetransfer({
        id:id,
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  cluefollowselect({
    commit
  },data) {
    return new Promise((resolve, reject) => {
      cluefollowselect(data).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  cluefollowadd({
    commit
  },followadd) {
    const {
      clueId,
      followType,
      followContent,
      followStatus,
      followTime,
      nextFollowTime,
      remark,
      enterpriseName
    }=followadd
    return new Promise((resolve, reject) => {
      cluefollowadd({
        clueId:clueId,
        followType:followType,
        followContent:followContent,
        followStatus:followStatus,
        followTime:followTime,
        nextFollowTime:nextFollowTime,
        remark:remark,
        enterpriseName:enterpriseName
      }).then(response => {
        console.log(response)
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
