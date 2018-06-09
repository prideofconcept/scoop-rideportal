import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import store from '@/store/store'

Vue.use(Router)

let router = new Router({
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
			path: '/login',
			name: 'login',
			component: Login
		}
	]
})

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	console.log('store.getters.isAuthenticated', store.getters.isAuthenticated)
	if(requiresAuth && store.getters.isAuthenticated === false) {
		next('/login')
	} else {
		next()
	}
})

export default router
