import Vue from 'vue'
import Vuex from 'vuex'

import firebaseApp from '@/firebase/'
import Firestore from '@/firebase/firestore'
import axios from 'axios'

import RidesModule from './modules/rides'
import AccountModule from './modules/account'

const ridesCollection = Firestore.collection('rides') // todo: should the collection come from an env var
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
		/* isFetchingEvents (state) {
			return state.fetching
		} */
	},
	mutations: {

		setEvents (state, payload) {
			Vue.set(state, 'events', payload)
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
				// console.log('Sending request to', this, 'with ID token in Authorization header.')
				const apiUrl = 'https://us-central1-yetigo-3b1de.cloudfunctions.net/httpsGetRetrieveCalendar/'
				// const apiUrl = 'http://localhost:5000/yetigo-3b1de/us-central1/httpsGetRetrieveCalendar/'

				axios.get(apiUrl, {
					method: 'GET',
					params: {
						email: state.account.user.email
					},
					headers: {
						'Authorization': 'Bearer ' + authToken
					}
				}).then(function (response) {
					console.log(`----recived rides`, response.data)
					commit('setEvents', response.data.events)
					commit('setEventsFetching', false)

				}.bind(this))
			}.bind(this))
		},

		GET_DB_RIDES ({commit, state}, payload) {
			commit('setEventsFetching', true)

			let ridesFamily = []
			let ridesDriver = []
			let rides = []

			console.log('--- grabbing db rides')

			const gurdnPrms = ridesCollection
				.where('guardian.email', '==', firebaseApp.auth().currentUser.email)
				.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						console.log(doc.id, '=>', doc.data())
						if (isRideWithinWeek(doc.data())) {
							rides.push(doc.data())
							ridesFamily.push(doc.data())
						}
					})
					return true
				})// todo: create catch and respond accordingly in promise.all

			const drvrPrms = ridesCollection
				.where('driver.email', '==', firebaseApp.auth().currentUser.email)
				.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						console.log(doc.id, '=>', doc.data())
						if (isRideWithinWeek(doc.data())) {
							rides.push(doc.data())
							ridesDriver.push(doc.data())
						}
					})
					return true
				})// todo: create catch and respond accordingly in promise.all
				/* .onSnapshot(this.handleCurrentRideUpdate.bind(this),
					(error) => { console.log("Error getting documents: ", error);}) */

			Promise.all([gurdnPrms, drvrPrms])
				.then( results => {
					console.log('done loading events', rides)
					commit('setEvents', rides)
					commit('setEventsFetching', false)

				})

			const isRideWithinWeek = ride => {
				// todo : only show rides that are 7 days in the future
				const now = new Date()
				let lastWeek = new Date()
				lastWeek.setDate(now.getDate() - 7)
				// console.log('comparing dates', ride.summary, lastWeek, ride.startdate, Date.parse(ride.startdate) > lastWeek)

				if (Date.parse(ride.startdate) > lastWeek) {
					return true
				}

				return false
			}

		},

		SET_CURRRIDE ({commit, state}, payload) {
			commit('setCurrentRide', payload, {root: true})
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
