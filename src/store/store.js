import Vue from 'vue'
import Vuex from 'vuex'

import firebaseApp from '@/firebase/'
import Firestore from '@/firebase/firestore'
import axios from 'axios'

import RidesModule from './modules/rides'
import AccountModule from './modules/account'

// todo: organize this with modules - https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/store/modules/auth.js

Vue.use(Vuex)
export default new Vuex.Store({
	modules: {
		ride: RidesModule(),
		account: AccountModule()
	},
	state: {
		events: []
	},
	getters: {
		loadedEvents (state) {
			return state.events
		}
	},
	mutations: {

		setEvents (state, payload) {
			console.log('setEvents -> ', payload)
			Vue.set(state, 'events', payload.events)
		}
	},
	actions: {


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


	}
})
