import firebaseApp from '@/firebase/'
import Firestore from '@/firebase/firestore'


//todo do we need to organize an api file like this: https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/api/index.js
export default () => ({
	state: {
		user: null,
	},
	getters: {
		user (state) {
			console.log('firebaseApp.auth().currentUser',firebaseApp.auth().currentUser)
			return state.user || firebaseApp.auth().currentUser
		},
		isAuthenticated (state) {
			console.log('firebaseApp.auth().currentUser',firebaseApp.auth().currentUser)

			// do we need to add in : https://stackoverflow.com/questions/37873608/how-do-i-detect-if-a-user-is-already-logged-in-firebase
			// or - https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/store/modules/auth.js - see getStoredAuth
			var user = state.user
			// const lsUser = Vue.localStorage.get('user')

			return (user !== null && user !== undefined)
		},
	},
	mutations: {
		setUser: (state, payload) => {
			state.user = payload
			Vue.localStorage.set('user', JSON.stringify(payload))
		},
	},
	actions: {
		LOGIN_SUCCESS ({commit}, payload) {
			commit('setUser', payload)
		},
	}
})
