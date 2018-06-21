import Vue from 'vue'
import Vuex from 'vuex'

import firebaseApp from '@/firebase/'
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
		events: [],
		isFetchingEvents: false
	},
	getters: {
		loadedEvents (state) {
			return state.events
		},
		/*isFetchingEvents (state) {
			return state.fetching
		}*/
	},
	mutations: {

		setEvents (state, payload) {
			Vue.set(state, 'events', payload.events)
		},

		setEventsFetching (state, payload) {
			console.log('setFetching -> ', payload)
			Vue.set(state, 'isFetchingEvents', payload)
		}
	},
	actions: {

		GET_CALRIDES_FIREBASE ({commit, state}, payload) {
			commit('setEventsFetching', true)
			firebaseApp.auth().currentUser.getIdToken().then(function (authToken) {
				console.log('Sending request to', this, 'with ID token in Authorization header.')
				const apiUrl = 'https://us-central1-yetigo-3b1de.cloudfunctions.net/httpsGetRetrieveCalendar/'
				//const apiUrl = 'http://localhost:5000/yetigo-3b1de/us-central1/httpsGetRetrieveCalendar/'

				axios.get(apiUrl, {
					method: 'GET',
					params: {
						email: state.account.user.email
					},
					headers: {
						'Authorization': 'Bearer ' + authToken
					}
				}).then(function(response) {
					console.log(response.data)
					commit('setEvents', response.data)
					commit('setEventsFetching', false)

				}.bind(this))
			}.bind(this))
		},

		SET_CURRRIDE ({commit, state}, payload) {
			commit('setCurrentRide', payload, {root:true})
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
		}
	}
})
