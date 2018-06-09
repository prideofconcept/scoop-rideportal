import * as firebase from 'firebase'
import router from '@/router'

import firebaseApp from '@/firebase/'

// todo do we need to organize an api file like this: https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/api/index.js
export default () => ({
	state: {
		user: null
	},
	getters: {
		user (state) {
			return state.user || firebase.auth().currentUser
		},
		isAuthenticated (state) {
			console.log('firebaseApp.auth().currentUser', firebase.auth().currentUser)

			// do we need to add in : https://stackoverflow.com/questions/37873608/how-do-i-detect-if-a-user-is-already-logged-in-firebase
			// or - https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/store/modules/auth.js - see getStoredAuth
			var user = state.user
			// const lsUser = Vue.localStorage.get('user')

			return (user !== null && user !== undefined)
		}
	},
	mutations: {
		setUser: (state, payload) => {
			state.user = payload
			// VueLocalStorage.set('user', JSON.stringify(payload))
		}
	},
	actions: {
		LOGIN_SUCCESS ({commit}, payload) {
			commit('setUser', payload)
			router.push('/')
		}
	}
})
