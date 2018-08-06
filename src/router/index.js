import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Pages/Dashboard'
import Login from '@/components/Pages/Login'
import store from '@/store/store'
import firebase from '@/firebase/'

Vue.use(Router)

let router = new Router({
	routes: [
		{
			path: '/',
			name: 'dashboard',
			component: Dashboard,
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
	//console.log('store.getters.isAuthenticated - beforeEachRouter', store.getters.isAuthenticated, firebase.auth().currentUser)
	if(requiresAuth && store.getters.isAuthenticated === false) {
		next('/login')
	} else {
		next()
	}
})

export default router
