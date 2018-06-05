import Vue from 'vue'
import Vuex from 'vuex'

import firebaseApp from './firebase'
import Firestore from '@/firebase/firestore'
import axios from 'axios'

// todo: organize this with modules - https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/store/modules/auth.js

Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		user: null,
		events: []
	},
	getters: {
		user (state) {
			return state.user || firebaseApp.auth().currentUser
		},
		isAuthenticated (state) {
			// do we need to add in : https://stackoverflow.com/questions/37873608/how-do-i-detect-if-a-user-is-already-logged-in-firebase
			// or - https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/store/modules/auth.js - see getStoredAuth
			var user = state.user
			// const lsUser = Vue.localStorage.get('user')

			return (user !== null && user !== undefined)
		},
		loadedEvents (state) {
			return state.events
		}
	},
	mutations: {
		setUser: (state, payload) => {
			state.user = payload
			Vue.localStorage.set('user', JSON.stringify(payload))
		},

		setEvents (state, payload) {
			console.log('setEvents -> ', payload)
			Vue.set(state, 'events', payload.events)
		}
	},
	actions: {
		LOGIN_SUCCESS ({commit}, payload) {
			commit('setUser', payload)
		},

		GET_CALRIDES_FIREBASE ({commit, state}, payload) {
			//console.log('GET_CALRIDES_FIREBASE:', state.user.getIdToken())
			firebaseApp.auth().currentUser.getIdToken().then(function (authToken) {
				console.log('Sending request to', this.helloUserUrl, 'with ID token in Authorization header.')
				const api_url = 'https://us-central1-yetigo-3b1de.cloudfunctions.net/httpsGetRetriveCalendar/'
				//const api_url = 'http://localhost:5000/yetigo-3b1de/us-central1/httpsGetRetriveCalendar/'
				axios.get(api_url, {
					method: 'GET',
					params: {
						email: 'drivers@scoopus.io'
					},
					headers: {
						'Authorization': 'Bearer ' + authToken
					}
				}).then(response => {
					console.log(response.data)
					commit('setEvents', response.data)
				})
			}.bind(this))
		},

		GET_CALRIDES ({commit}, payload) {
			payload.$getGapiClient().then(gapi => {
				if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
					gapi.auth2.getAuthInstance().signIn()
				}

				gapi.client.calendar.events.list({
					'calendarId': 'primary',
					// 'timeMin': (new Date()).toISOString(), // todo add timeMin back into api call
					'showDeleted': false,
					'singleEvents': true,
					'maxResults': 10,
					'orderBy': 'startTime'
				}).then((response) => commit('setEvents', {events: response.result.items}))
			})
		},

		startRide ({commit, state}, payload) {
			console.log('starting ride');
		}
	}
})
