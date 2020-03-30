import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app' //siderbar 等外部框架
import settings from './modules/settings'
import user from './modules/user' //用户体系
import permission from './modules/permission' //路由拦截
import callcenter from './modules/callcenter' //呼叫中心
import cluesmanage from './modules/cluesmanage' // 发现线索
import company from './modules/company' //企业主页
import myclue from './modules/myclue' //我的线索
import recycle from './modules/recycle' //回收站
import companysearch from './modules/companysearch' //企业搜索
import cluedetails from './modules/cluedetails' //线索明细
import accountoverview from './modules/accountoverview' //账户总览
import callform from './modules//callform' //通用通话表单弹窗

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    callcenter,
    cluesmanage,
    company,
    myclue,
    recycle,
    companysearch,
    cluedetails,
    accountoverview,
    callform
  },
  getters
})

export default store
