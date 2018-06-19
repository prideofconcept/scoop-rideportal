import * as firebase from 'firebase'
import Firestore from '@/firebase/firestore'

import router from '@/router'

const driverCollection = Firestore.collection('drivers') // todo: should the collection come from an env var
// todo do we need to organize an api file like this: https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/api/index.js
export default () => ({
	state: {
		user: null,
		isDriver: false,
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
		},
		reportUserIsDriver: (state, payload) => {
			state.isDriver = payload
		},
	},
	actions: {
		LOGIN_SUCCESS ({commit}, payload) {
			commit('setUser', payload)
			router.push('/')
		},
		LOGOUT_SUCCESS ({commit}, payload) {
			commit('setUser', null)
			router.push('/login')
		},
		RetrieveDriverStatus ({commit, state}, payload) {
			driverCollection
				.doc(state.user.uid)
				.get()
				.then((doc) => {
					if(doc.exists){
						commit('reportUserIsDriver', true)
					}
				})
		}
	}
})
