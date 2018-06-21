<template>
<div>

	<div class="row">
		<div class="col-12">
			<h6 class="headline">Dashboard</h6>
			<h6>{{ msg }} <span v-on:click="logoutUser" class="oi oi-account-logout">&nbsp;</span></h6>
		</div>
	</div>

	<CurrentRideView/>

	<div class="row">
		<div class="col-12 pt-4">
			<h5 class="headline">Upcoming Rides</h5>
			<LoadingIndicator v-show="isFetching"/>
		</div>
		<ride-item-overview v-for="ride in rides" v-bind:key="ride.id" v-bind:ride="ride"></ride-item-overview>
	</div>

</div>
</template>

<script>
import firebaseApp from '../../firebase/index'
import RideItemOverview from '../RideItemOverview'
import LoadingIndicator from '../loadingIndicator'
import CurrentRideView from '../CurrentRideView'
export default {
	components: {RideItemOverview, CurrentRideView, LoadingIndicator},
	name: 'Dashboard',
	data () {
		return {
			msg: `${this.$store.getters.user.displayName || this.$store.getters.user.email}`
		}
	},
	computed: {
		rides () {
			return this.$store.state.events
		},
		isFetching () {
			return this.$store.state.isFetchingEvents
		},
		onRide () {
			return this.$store.state.ride.onRide
		},
		currentRide () {
			return this.$store.state.ride.currentRide
		}
	},
	methods: {
		clickLink () {},
		logoutUser: function () {
			console.log('click logout')
			firebaseApp.auth().signOut()
				.then( data => {
					// console.log(`You are logged in as ${data.user.email}`);
					this.$store.dispatch('LOGOUT_SUCCESS')
				})
				.catch( err => {
					// todo: handle error -
					console.log('logout error:', err.message)
				})
		}
	},
	created () {
		this.$store.dispatch('GET_CALRIDES_FIREBASE')
		// this.$store.dispatch('GET_CALRIDES', {$getGapiClient: this.$getGapiClient})
	},

	updated () {
		console.log('updateded: currentRide', this.currentRide)

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1, h2 {
		font-weight: normal;
	}

	.headline {
		text-transform: uppercase;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #42b983;
	}
</style>
