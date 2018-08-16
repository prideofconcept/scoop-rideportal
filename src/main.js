// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import router from './router'
import store from './store/store'

import * as VueGoogleMaps from "vue2-google-maps";

import VueGAPI from 'vue-gapi'
import VueLocalStorage from 'vue-localstorage'
import * as firebase from 'firebase'

import 'babel-polyfill'

Vue.config.productionTip = false

const gapiConfig = {
	apiKey: 'AIzaSyBOrnRjGh5HUYxAQHxo6XXFNx8fPbyIZvQ',
	clientId: '811912282396-n1htmi2pmjbh58gice6e8e1hi6h7eg2i.apps.googleusercontent.com',
	discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
	scope: 'https://www.googleapis.com/auth/calendar.readonly',
	hostedDomain: 'yetigo.io'
	// see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
}

Vue.use(VueGAPI, gapiConfig)
Vue.use(VueLocalStorage)
Vue.use(Vuex)
Vue.use(VueGoogleMaps, {
	load: {
		key: "AIzaSyCIyQ7nNZDSIQgMUFJ9dT1FEpsLVmpLYLw",
		libraries: "places, geocoder" // necessary for places input
	}
});
/* eslint-disable no-new */
firebase.auth().onAuthStateChanged((user) => {
	new Vue({
		el: '#app',
		router,
		store,
		components: { App },
		template: `<App/>`,
		created () {
			// todo: add in created functions from  https://github.com/academind/yt-devmeetup-vue-firebase/blob/14-save-firebase-check-auth/src/main.js
			// this.$store.dispatch('GET_CALRIDES', {$getGapiClient: this.$getGapiClient})
				if(user != null) {
					this.$store.dispatch('LOGIN_SUCCESS', user)
					this.$store.dispatch('GET_DB_RIDES')
				}
		}
	})
})

