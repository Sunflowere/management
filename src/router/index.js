import store from '../store'
import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    component: () => import('../views/Manage.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: '首页',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/user',
        name: '用户管理',
        component: () => import('../views/User.vue')
      },
      {
        path: '/role',
        name: '角色管理',
        component: () => import('../views/Role.vue')
      },
      {
        path: '/menu',
        name: '菜单管理',
        component: () => import('../views/Menu.vue')
      },
      {
        path: '/person',
        name: '个人信息',
        component: () => import('../views/Person.vue')
      },
      { path: 'file', 
        name: '文件管理', 
        component: () => import('../views/File.vue')
      },
      {
        path: '/department',
        name: '部门管理',
        component: () => import('../views/department.vue')
      },
      {
        path: '/device',
        name: '设备管理',
        component: () => import('../views/Device.vue')
      },
      {
        path: '/econsumption',
        name: '用电数据',
        component: () => import('../views/Econsumption.vue')
      },
      {
        path: '/wconsumption',
        name: '用水数据',
        component: () => import('../views/Wconsumption.vue')
      },
      {
        path: '/analysis',
        name: '能耗分析',
        component: () => import('../views/AnalysisE.vue')
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originaPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originaPush.call(this, location).catch(err => err)
}

//路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name) //设置当前路由名称，为了在Header组件中去使用
  store.commit("setPath") //触发store的数据更新
  next()  //放行路由
})

export default router
