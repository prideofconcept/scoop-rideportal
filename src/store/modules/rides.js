import router from '@/router'
import firebase from '@/firebase'

// todo do we need to organize an api file like this: https://github.com/CityOfPhiladelphia/taskflow-ui/blob/master/src/api/index.js
export default () => ({
	state: {

	},
	mutations: {

	},
	actions: {
		startRide ({commit, state}, payload) {
			console.log('starting ride')
		}
	}
})
