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
}]

// {
//   path: "/regester",
//   component: () => import("@/views/regester/index"),
//   hidden: true
// }

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
  router.routes({
    path: '/login',
    name: 'login'
  })
}

//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [{
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [{
      path: "dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/index"),
      meta: {
        title: "企业主页",
        icon: "dashboard"
      }
    }]
  },
  {
    path: "/dashboard",
    component: Layout,
    redirect: "/dashboard",
    children: [{
      path: "dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/index"),
      meta: {
        title: "工作台",
        icon: "workbench",
        roles: ['admin', 'super']
      }
    }]
  },
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
          icon: "newcompany",
          roles: ['admin', 'super']
        }
      },
      {
        path: "companysearch",
        name: "companysearch",
        component: () => import("@/views/foundclues/companysearch/index"),
        meta: {
          title: "企业搜索",
          icon: "searchcompany",
          roles: ['super', 'admin']
        }
      }
    ]
  },
  {
    path: "/cluesmanagement",
    component: Layout,
    name: "Form",
    redirect: "/cluesmanagement/listmanage",
    meta: {
      title: "线索管理",
      icon: "admin"
    },
    children: [{
        path: "listmanage",
        name: "listmanage",
        component: () => import("@/views/cluesmanagement/listmanage/index"),
        meta: {
          title: "名单管理",
          icon: "databag",
          roles: ['super', 'admin', 'seat']
        }
      },{
        path: "databag",
        name: "databag",
        component: () => import("@/views/cluesmanagement/databag/index"),
        meta: {
          title: "销售商机",
          icon: "databag",
          roles: ['super', 'admin', 'seat']
        }
      },
      {
        path: "privatesea",
        name: "privatesea",
        component: () => import("@/views/cluesmanagement/privatesea/index"),
        meta: {
          title: "我的线索",
          icon: "privatesea",
          roles: ['super']
        }
      },
      {
        path: "recycle",
        name: "recycle",
        component: () => import("@/views/cluesmanagement/recycle/index"),
        meta: {
          title: "回收站",
          icon: "recycle",
          roles: ['super', 'admin']
        }
      }
    ]
  },

  {
    path: "/nested",
    component: Layout,
    redirect: "/reach/callcenter/index",
    name: "Nested",
    meta: {
      title: "触达管理",
      icon: "zhudongchuda"
    },
    children: [{
        path: "menu1",
        name: "Menu1",
        component: () => import("@/views/reach/callcenter/index"), // Parent router-view
        meta: {
          title: "呼叫中心",
          icon: "callcenter",
          roles: ['super', 'seat']
        },
      },
      {
        path: "menu2",
        component: () => import("@/views/reach/message/index"),
        meta: {
          title: "短信",
          icon: "message",
          roles: ['super', 'seat']
        }
      },

      {
        path: "menu3",
        component: () => import("@/views/reach/ai/index"),
        meta: {
          title: "AI机器人",
          icon: "ai",
          roles: ['super', 'seat']
        }
      }
    ]
  },
  {
    path: "/expenses",
    component: Layout,
    redirect: "/reach/callcenter/index",
    name: "",
    meta: {
      title: "费用中心",
      icon: "count"
    },
  },
  {
    path: "/analysis",
    component: Layout,
    redirect: "/reach/callcenter/index",
    name: "",
    meta: {
      title: "统计分析",
      icon: "analysis"
    },
  },
  {
    path: "/regester",
    redirect:"/regester",
    component: () => import("@/views/regester/index"),
    name:'regester',
    hidden: true,
    alwaysShow: true,
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
