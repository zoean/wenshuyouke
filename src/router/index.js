import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

//实例化vue的时候只挂载constantRouter
export const constantRoutes = [{
  path: "/login",
  component: () => import("@/views/login/index"),
  hidden: true
},{
  path: "/regester",
  component: () => import("@/views/regester/index"),
  hidden: true
}]

export const notFoundRoutes = [{
  path: "/404",
  component: () => import("@/views/404"),
  hidden: true
},
{
  path: "*",
  redirect: "/404",
  hidden: true
}]


const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    path: '/login',
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
  // router.routes({
  //   path: '/login',
  //   name: 'login'
  // })
}
export const componentsMap = {
  layout: () => import('@/layout'),
  home: () => import('@/views/home/index'),//企业这一页
  newcompanysearch: () => import('@/views/foundclues/newcompanysearch/index'),//发现线索-新企推荐
  companysearch: () => import('@/views/foundclues/companysearch/index'),//发现线索-企业搜索
  listmanage: () => import('@/views/cluesmanagement/listmanage/index'),//线索管理-名单管理
  saleslead: () => import('@/views/cluesmanagement/saleslead/index'),//线索管理-销售商机
  privatesea: () => import('@/views/cluesmanagement/privatesea/index'),//线索管理-我的线索
  recycle: () => import('@/views/cluesmanagement/recycle/index'),//线索管理-回收站
  cluedetails: () => import('@/views/expensecenter/cluedetails/index'),//费用中心-线索明细
  calldetails: () => import('@/views/expensecenter/calldetails/index'),//费用中心-通话详情
  department: () => import('@/views/department/index'),//设置中心-部门用户设置
  rolepermission: () => import('@/views/rolepermission/index'),//设置中心-角色权限设置
  user: () => import('@/views/ukadmin/user')//优数管理中心-企业帐户管理
}
//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [{
      path: "/",
      component: Layout,
      redirect: "/home",
      meta: {
        title: "企业主页",
        icon: "dashboard"
      },
      children: [{
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: {
          title: "企业主页",
          icon: "dashboard"
        }
      }]
    },

  // {
  //   path: "/dashboard",
  //   component: Layout,
  //   redirect: "/dashboard",
  //   children: [{
  //     path: "dashboard",
  //     name: "Dashboard",
  //     component: () => import("@/views/dashboard/index"),
  //     meta: {
  //       title: "工作台",
  //       icon: "workbench",
  //       roles: ['admin', 'super']
  //     }
  //   }]
  // },
  {
    path: "/foundclues",
    component: Layout,
    redirect: "/foundclues/newcompanysearch",
    name: "Example",
    meta: {
      title: "发现线索",
      icon: "found",
      roles: ['admin', 'super']
    },
    children: [{
        path: "newcompanysearch",
        name: "newcompanysearch",
        component: () => import("@/views/foundclues/newcompanysearch/index"),
        meta: {
          title: "新企推荐",
          icon: "newcompany"
        }
      },
      {
        path: "companysearch",
        name: "companysearch",
        component: () => import("@/views/foundclues/companysearch/index"),
        meta: {
          title: "企业搜索",
          icon: "searchcompany"
        }
      }
    ]
  },
  {
    path: "/cluesmanagement",
    component: Layout,
    name: "cluesmanagement",
    redirect: "/cluesmanagement/saleslead",
    meta: {
      title: "线索管理",
      icon: "admin",
      roles:['seat','admin']
    },
    children: [{
        path: "listmanage",
        name: "listmanage",
        component: () => import("@/views/cluesmanagement/listmanage/index"),
        meta: {
          title: "名单管理",
          icon: "databag",
          roles: ['super', 'admin']
        }
      }, {
        path: "saleslead",
        name: "saleslead",
        component: () => import("@/views/cluesmanagement/saleslead/index"),
        meta: {
          title: "销售商机",
          icon: "saleslead",
          roles: ['super', 'seat']
        }
      },
      {
        path: "privatesea",
        name: "privatesea",
        component: () => import("@/views/cluesmanagement/privatesea/index"),
        meta: {
          title: "我的线索",
          icon: "myclues",
          roles: ['super', 'seat']
        }
       },
       {
        path: "details",
        name: "details",
        component: () => import("@/views/cluesmanagement/privatesea/details"),
      },
      {
        path: "recycle",
        name: "recycle",
        component: () => import("@/views/cluesmanagement/recycle/index"),
        meta: {
          title: "回收站",
          icon: "recycle",
          roles: ['super', 'seat']
        }
      }
    ]
  },

  // {
  //   path: "/nested",
  //   component: Layout,
  //   redirect: "/reach/callcenter/index",
  //   name: "Nested",
  //   meta: {
  //     title: "触达管理",
  //     icon: "zhudongchuda"
  //   },
  //   children: [{
  //       path: "menu1",
  //       name: "Menu1",
  //       component: () => import("@/views/reach/callcenter/index"), // Parent router-view
  //       meta: {
  //         title: "呼叫中心",
  //         icon: "callcenter",
  //         roles: ['super', 'seat']
  //       },
  //     },
  //     {
  //       path: "menu2",
  //       component: () => import("@/views/reach/message/index"),
  //       meta: {
  //         title: "短信",
  //         icon: "messagedetails",
  //         roles: ['super', 'seat']
  //       }
  //     },

  //     {
  //       path: "menu3",
  //       component: () => import("@/views/reach/ai/index"),
  //       meta: {
  //         title: "AI机器人",
  //         icon: "ai",
  //         roles: ['super', 'seat']
  //       }
  //     }
  //   ]
  // },
  {
    path: "/expenses",
    component: Layout,
    redirect: "/expenses/calldetails",
    name: "expensecenter",
    meta: {
      title: "费用中心",
      icon: "count"
    },
    alwaysShow: true,
    children:[
    // {
    //   path:'accountoverview',
    //   component:() => import("@/views/expensecenter/accountoverview/index"),
    //   name:'accountoverview',
    //   meta:{
    //     title:'帐户总览',
    //     icon:'accountoverview'
    //   }
    // },
    {
      path:'cluedetails',
      component:() => import("@/views/expensecenter/cluedetails/index"),
      name:'cluedetails',
      meta:{
        title:'线索明细',
        icon:'cluedetails'
      }
    },{
      path:'/calldetails',
      component:() => import("@/views/expensecenter/calldetails/index"),
      name:'calldetails',
      meta:{
        title:'通话详情',
        icon:'phone',
        roles:['admin', 'seat']
      }
    }]
  },
  // {
  //   path: "/analysis",
  //   component: Layout,
  //   redirect: "/reach/callcenter/index",
  //   name: "",
  //   meta: {
  //     title: "统计分析",
  //     icon: "analysis"
  //   }
  // },
  {
    path: "/set",
    component: Layout,
    redirect: "/set/department",
    meta:{
      title: "设置中心",
      icon: "setcenter",
      roles:['admin']
    },
    children: [{
      path: "department",
      name: "department",
      component: () => import("@/views/department/index"),
      meta: {
        title: "部门用户设置",
        icon: "department",
        roles:['admin']
      }
    },{
      path: "rolepermission",
      name: "rolepermission",
      component: () => import("@/views/rolepermission/index"),
      meta: {
        title: "角色权限设置",
        icon: "rolepermission",
        roles:['admin']
      }
    }]
  },
  {
    path: "/wtuk",
    redirect:"/ukadmin/user",
    component: Layout,
    name: "ukadmin",
    meta: {
      title: "优客管理中心",
      icon: "dashboard",
      roles: ['super']
    },
    alwaysShow: true,
    children: [{
      path: "ukadmin/user",
      name: "entAccount",
      component: () => import("@/views/ukadmin/user"),
      meta: {
        title: '企业帐户管理',
        icon: "dashboard"
      }
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
]

export default router;
