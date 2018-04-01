import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import SignIn from '@/components/SignIn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: HelloWorld,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn
    }
  ]
})
