import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './firebase'

// todo: organize this with modules - https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/store/modules/auth.js

Vue.use(Vuex)

export default new Vuex.Store({
	store: {
		user: null,
		events: []
	},
	getters: {
		user (state) {
			return state.user || firebase.auth().currentUser
		},
		isAuthenticated (state) {
			const lsUser = Vue.localStorage.get('user');
			if(lsUser !== undefined && lsUser !== null) {
				state.user = JSON.parse(lsUser)
			}

			return (state.user !== null && state.user !== undefined)
		},
		loadedEvents (state) {
			return state.events
		}
	},
	mutations: {
		setUser (state, payload) {
			state.user = payload

			Vue.localStorage.set('user', JSON.stringify(payload))
		},

		setEvents (state, payload) {
			console.log('setEvents -> ', payload)
			state.events = payload.events
		}
	},
	actions: {
		LOGIN_SUCCESS ({commit}, payload) {
			commit('setUser', payload)
		},

		GET_CALRIDES ({commit}, payload) {
			payload.$getGapiClient().then(gapi => {
				if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
					gapi.auth2.getAuthInstance().signIn()
				}

				gapi.client.calendar.events.list({
					'calendarId': 'primary',
					'timeMin': (new Date()).toISOString(),
					'showDeleted': false,
					'singleEvents': true,
					'maxResults': 10,
					'orderBy': 'startTime'
				}).then( (response) => commit('setEvents', {events: response.result.items}) )
			})
		}
	}
})
