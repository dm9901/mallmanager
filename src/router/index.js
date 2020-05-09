import Vue from 'vue'
import Router from 'vue-router'

// 导入组件
// import Login from '../components/login/login.vue'
// @ 在vue-cli中“@”可以自动的找到src目录，所以，可以简写为
import Login from '@/components/login/login.vue'

// 导入home组件
import Home from '@/components/home/home.vue'

// 导入用户管理组件users
import Users from '@/components/users/users.vue'

// 导入权限列表组件
import Rights from '@/components/rightsManager/rights/rights.vue'

// 导入角色列表组件
import Roles from '@/components/rightsManager/roles/roles.vue'

import Welcome from '@/components/welcome/welcome.vue'


Vue.use(Router)

export default new Router({
  routes: [{
      //配置login路由
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      //welcome
      name: 'welcome',
      path: '/welcome',
      component: Welcome
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: 'users',
        component: Users
      }, {
        name: 'rights',
        path: 'rights',
        component: Rights
      }, {
        name: 'roles',
        path: 'roles',
        component: Roles
      }]
    }
  ]
})
