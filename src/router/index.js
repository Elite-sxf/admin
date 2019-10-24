import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Index from '../components/index.vue'
import Users from '../components/users.vue'
import Roles from '../components/roles.vue'
import Rights from '../components/rights.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: Login },
  { path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
