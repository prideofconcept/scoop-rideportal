// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'

import App from './App'
import router from './router'
import store from './store'
import VueGAPI from 'vue-gapi'

import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import 'babel-polyfill'

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	if(requiresAuth && false) { // todo: im guessing this should grab from local storage
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

const gapiConfig = {
	apiKey: 'AIzaSyBOrnRjGh5HUYxAQHxo6XXFNx8fPbyIZvQ',
	clientId: '811912282396-n1htmi2pmjbh58gice6e8e1hi6h7eg2i.apps.googleusercontent.com',
	discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
	scope: 'https://www.googleapis.com/auth/calendar.readonly',
	hostedDomain: 'yetigo.io'
	// see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
}

Vue.use(Vuetify)
Vue.use(VueGAPI, gapiConfig)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: `<App/>`
})
