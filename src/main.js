// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import 'babel-polyfill'

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	debugger
	if(requiresAuth && true) { //todo: im guessing this should grab from local storage
		next('/login')
	} else {
		next()
	}

	/*
	let user = localstorage.getItem('user')
    let token = localstorage.getItem('token')
    if (user && token) {
      store.commit(types.LOGIN_SUCCESS, {token, user})
      next()
    }
    else if (!store.getters.isAuthenticated) {
      store.dispatch(types.LOGIN).then(() => next())
    } else {
      next()
    }
	* */
})

Vue.use(Vuetify)
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: `<App/>`
})
