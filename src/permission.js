import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import { getLocalStorage } from '@/utils/index'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/regester'] // no redirect whitelist
let flag = 0
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page      
      next({ path: '/' })
      NProgress.done()
    } else {
      let userMenus = store.getters.userMenus && store.getters.roles.length > 0
      // let userMenus = getLocalStorage('u_r')
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (userMenus || flag > 0) {
        next()
      } else {
        try {
          // get user info
          if(flag == 0){
            await store.dispatch('user/getInfo')
          }
            // userMenus = getLocalStorage('u_r')
          if(store.getters.userMenu){
            const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.userMenu)
            // dynamically add accessible routes
            router.addRoutes(accessRoutes)
            router.options.routes.push(...accessRoutes)
            flag++
            next({
              ...to,
              replace: true
            })
          }else{
            Message.error('您暂未分配角色，请联系管理员')
          }        
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
