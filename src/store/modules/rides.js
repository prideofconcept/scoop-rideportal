import Firestore from '@/firebase/firestore'

const rideLogCollection = Firestore.collection('ride_log') // todo: should the collection come from an env var

// todo do we need to organize an api file like this: https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/api/index.js
export default () => ({
	state: {
		onRide: false,
		currentRide: null,
		fetching: false
	},
	mutations: {
		reportSaveRideLogSuccess (state, result) {
			state.fetching = false
		},
		reportRideStart (state, result) {
			state.currentRide = result.ride
			state.onRide = true
		},
		reportRideEnd (state, result) {
			state.fetching = false
		}
	},
	actions: {
		startRide ({ commit, state }, payload) {
			const ride = payload
			console.log('starting ride', ride)

			const date = new Date()
			const dateString = `${date.toLocaleString('en-us', {
				month: 'short'
			})}:${date.getDate()} ${date.toLocaleTimeString()}`

			rideLogCollection
				.doc(dateString + ' :: ' + ride.summary)
				.set({
					url: ride.url,
					sceduled_time: ride.startdate,
					id: ride.id,
					driver_id: 0,
					family_id: 0,
					start_time: date
				})
				.then(() => {
					commit('reportSaveRideLogSuccess', true)
					commit('reportRideStart', ride)
				}) // todo: handle errors
		}
	}
})
