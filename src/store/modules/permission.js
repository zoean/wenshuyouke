import {
  asyncRouterMap,
  constantRoutes
} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: constantRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

// const actions = {
//   generateRoutes({
//     commit
//   }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes = asyncRouterMap.filter(v => {
//         if (roles.indexOf('super') >= 0) return true;
//         if (hasPermission(roles, v)) {
//           if (v.children && v.children.length > 0) {
//             v.children = v.children.filter(child => {
//               if (hasPermission(roles, child)) {
//                 return child
//               }
//               return false;
//             });
//             return v
//           } else {
//             return v
//           }
//         }
//         return false;
//       })
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }
// }

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // if (roles.includes('super')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
        accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
