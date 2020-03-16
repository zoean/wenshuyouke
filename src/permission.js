import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken,
  setToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/regester'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  let roles = store.getters.roles
  if (hasToken) { 
    console.log(roles)
    if (to.path === '/login' || to.path === '/home' && roles.length > 0) {
      console.log('去登录有权限')
      // if is logged in, redirect to the home page
      if(roles.indexOf('admin') >=0){
        if(to.path == '/home'){
          next()
        }else{
          next({
            path: '/home'
          })
        }        
      }else if(roles.indexOf('seat') >=0){
        if(to.path == '/cluesmanagement/saleslead'){
          next()
          NProgress.done()
        }else{
          next({ path: '/cluesmanagement/saleslead'})
          NProgress.done()
        }
      }
      
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.roles)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          router.options.routes.push(accessRoutes)
          if(store.getters.roles.indexOf('seat') >= 0){
            if(to.path == '/cluesmanagement/saleslea'){
              next()
            }else{
              next({
                path: '/cluesmanagement/saleslea'
              })
            }
          }
          // next({
          //   ...to,
          //   replace: true
          // })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
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
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
