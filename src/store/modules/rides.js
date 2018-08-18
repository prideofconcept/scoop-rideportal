import Firestore from '@/firebase/firestore'

const rideLogCollection = Firestore.collection('ride_log') // todo: should the collection come from an env var
const currentRideCollection = Firestore.collection('ride_current') // todo: s houdl the collections be exported from the firebase module

// todo do we need to organize an api file like this: https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/api/index.js
export default () => ({
	state: {
		onRide: false,
		currentRide: null,
		fetching: false,
		ride_statuses: ['pending', 'picking_up', 'driving', 'dropping_off', 'complete'],
	},
	mutations: {
		reportSaveRideLogSuccess (state, result) {
			state.fetching = false
		},
		reportRideStart (state, result) {
			state.currentRide = result
			state.onRide = true
		},
		reportRideStop (state, result) {
			state.currentRide = null
			state.onRide = false
		},
		setCurrentRide (state, payload) {
			state.currentRide = payload
			if(payload != null) {
				state.onRide = true
			} else {
				state.onRide = false
			}
		},
		/* setCurrentRideLocal (state, payload) {
			console.log('updating location', payload )
			state.currentRideLocale = payload
			if(payload != null) {
				state.onRide = true
			} else {
				state.onRide = false
			}
		} */
	},
	actions: {
		SET_CURRRIDE_LOCATION ({commit, state}, payload) {
			currentRideCollection.doc(state.currentRide.id)
				.set({
					current_locale: payload
				}, {merge: true})
		},
		startRide ({ commit, state }, payload) {
			const ride = payload
			console.log('starting ride', ride)

			// todo: move to util module
			const date = new Date()
			const dateString = `${date.toLocaleString('en-us', {
				month: 'short'
			})}:${date.getDate()} ${date.toLocaleTimeString()}`

			rideLogCollection
				.doc(ride.id + ' :: ' + ride.summary)
				.set({
					url: ride.url,
					sceduled_time: ride.startdate,
					id: ride.id,
					status: 'started',
					start_time: date
				})
				.then(() => {
					commit('reportSaveRideLogSuccess', true)
					commit('reportRideStart', ride)
				}) // todo: handle errors

			currentRideCollection.doc(`${ride.id}`)
				.set({
					...ride,
					driver: ride.driver,
					guardian: ride.guardian,
				})
		},
		SET_CURRENT_STEP ({ commit, state }, payload) {
			const currentRideId = payload
			const currRide = state.currentRide
			console.log('updating ride to step ', currentRideId)

			currentRideCollection
				.doc(`${currRide.id}`)
				.set({currentStep: currentRideId},
					{merge: true})
				.then(() => {
					// todo do we need to commit anything here?
					console.log('step saved in currentRide')
				})
		},
		STOP_CURRENT_RIDE ({ commit, state }) {
			const ride = state.currentRide
			console.log('stopping ride', ride.id)

			// todo: move to util module
			const date = new Date()
			const dateString = `${date.toLocaleString('en-us', {
				month: 'short'
			})}:${date.getDate()} ${date.toLocaleTimeString()}`

			rideLogCollection
				.doc(ride.id + ' :: ' + ride.summary)
				.set({
					status: 'finished',
					stop_time: date
				}, {merge: true})
				.then(() => {
					commit('reportSaveRideLogSuccess', true)
					commit('reportRideStop', ride)
				}) // todo: handle errors

			currentRideCollection
				.doc(`${ride.id}`)
				.delete()
		}
	}
})
