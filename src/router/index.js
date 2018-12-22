import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/home.vue'
import Login from '@/components/login/login.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/rights/rights.vue'
import Roles from '@/components/roles/roles.vue'
import { Message } from 'element-ui'

Vue.use(Router)

var router = new Router({
  routes: [
    {path: '/', redirect:{path: '/home'}},
    {path: '/home', name: 'home', component: Home, children: [
        {path: '/users', name: 'users', component: Users},
        {path: '/rights', name: 'rights', component: Rights},
        {path: '/roles', name: 'roles', component: Roles}
      ]},
    {path: '/login', name: 'login', component: Login}
  ]
})

// 导航守卫作用:
//   当路由从一个路由跳转到另一个路由时,	就会触发导航守卫, 我们可以在导航守卫中
// 加上自己的逻辑代码
// 路由守卫
router.beforeEach((to, from, next) => {
  // to：到哪里去
  // from: 从哪里来
  // next:是否继续向下执行代码  类似于Nodejs中的 中间件
  if (to.name != 'login') {
    // 验证是否存在token
    var token = window.localStorage.getItem('token')
    if (!token) {
      router.push({ name: 'login' });
      Message.error('您还没有登录，请登录')
      return; // 不执行后面的代码
    }
  }
  next()
})
export default router
