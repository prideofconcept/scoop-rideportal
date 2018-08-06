<template>

	<div id="CurrentRideView" class="col-12 white--text my-4 p-4" v-if="currentRide">
		<h6 class="headline">Current Ride</h6>
		<div class="row">
			<div class="col-12">
				<h6 class="text-center">{{currentRide.summary}}</h6>
				<p>status: </p>
				<google-map/>
			</div>
		</div>

		<section class="row steps pb-4">
			<div class="col-12" v-show="step_pickup"><button class="btn btn-small" v-bind:href="pickupHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to pickup</button></div>
			<div class="col-12" v-show="step_pickup">Meet / Pickup Child</div>
			<div class="col-12" v-show="step_pickup">
				Check Safety and Start Navigation
				<br/>
				<button class="btn btn-small" v-bind:href="dropoffHref" target="_blank"><i>Nav to Dropoff</i></button></div>
			<div class="col-12" v-show="step_pickup">
				Walk Child to Drop-off
			</div>
			<div class="col-12" v-show="step_pickup">
				Finish Ride
			</div>
			<div class="col-12">
				<button class="btn btn-light text-center"><h4><i class="oi oi-arrow-right-angle"></i>Next Step</h4></button>
			</div>
		</section>

		<div id="rideControlPanel" class="row" v-show="(isDriver)">
			<div class="col-6">
				<div class="nav-display">
					<p class="nav-desc"><span><i class="oi oi-data-transfer-download mr-2"></i>pickup:</span><br/> {{currentRide.location}}</p>
					<a class="btn btn-small btn-secondary" v-bind:href="pickupHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to pickup</a>
					<a class="btn btn-small btn-secondary-white" v-bind:href="pickupWaze" target="_blank"><i class="oi oi-location mr-2"></i>waze</a>
				</div>
			</div>
			<div class="col-6">
				<div class="nav-display">
					<p class="nav-desc"><span><i class="oi oi-data-transfer-upload mr-2"></i>drop-off:</span><br/> {{currentRide.description}}</p>
					<a class="btn btn-small btn-secondary" v-bind:href="dropoffHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to dest</a>
					<a class="btn btn-small btn-secondary-white" v-bind:href="dropoffWaze" target="_blank"><i class="oi oi-location mr-2"></i>waze</a>
				</div>
			</div>
			<p>notes:</p>
			<div class="white--text">
				<button v-on:click.prevent="onStopRide" class="btn btn-light">Finish Ride</button>
			</div>
		</div>


	</div>

</template>

<script>
import * as firebase from 'firebase'
import Firestore from '@/firebase/firestore'
import GoogleMap from "@/components/GoogleMaps";

const currentRideCollection = Firestore.collection('ride_current') // todo: s houdl the collections be exported from the firebase module

export default {
	components: {
		GoogleMap
	},
	props: {
	},
	data () {
		return {
			step_pickup: true,
		}
	},
	computed: {
		currentRide () { return this.$store.state.ride.currentRide },
		isDriver () { return this.$store.state.account.isDriver },
		destination () { return this.currentRide.description },
		pickupHref () { return `http://maps.google.com/?daddr=${this.currentRide.location}` },
		dropoffHref () { return `http://maps.google.com/?daddr=${this.currentRide.description}` },
		pickupWaze () { return `https://waze.com/ul?q=${encodeURIComponent(this.currentRide.location)}` },
		dropoffWaze () { return `https://waze.com/ul?q=${encodeURIComponent(this.currentRide.description)}` },
	},
	methods: {
		onStopRide: function (e) {
			// throw up a warning before allowing this action
			this.$store.dispatch('stopRide', this.currentRide)
		},
		handleCurrentRideUpdate: function (querySnapshot) {

			querySnapshot.docChanges().forEach(function (change) {
				if (change.type === 'removed') {
					this.$store.dispatch('SET_CURRRIDE', null)
				}
			}.bind(this))

			if(querySnapshot.empty || querySnapshot.docs.length <= 0) {
				return
			}

			querySnapshot.forEach(function (doc) {
				const currentRide = doc.data()
				this.$store.dispatch('SET_CURRRIDE', currentRide)
			}.bind(this))

			if(navigator.geolocation)
				navigator.geolocation.getCurrentPosition(this.onPositionUpdate.bind(this))
			else
				alert('navigator.geolocation is not available')
		},
		onPositionUpdate: function (position) {

			if(position.coords){
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				if (this.$store) {
					console.log('this.$store', this.$store)
					this.$store.dispatch('SET_CURRRIDE_LOCATION', { lat, lng })
				}
			}
		}
	},
	mounted () {
		console.log('asking for current ride')
		currentRideCollection
			.where('guardian.email', '==', firebase.auth().currentUser.email )
			.onSnapshot(this.handleCurrentRideUpdate.bind(this),
				(error) => { console.log('Error getting documents: ', error)
				})

		currentRideCollection
			.where('driver.email', '==', firebase.auth().currentUser.email)
			.onSnapshot(this.handleCurrentRideUpdate.bind(this),
				(error) => { console.log('Error getting documents: ', error)
				})

	}
}
</script>

<style scoped>
	#CurrentRideView{
		background-color: #bfe3d4;
	}
	.headline {
		font-weight: bold;
		text-transform: uppercase;
	}

	.oi {
		top: 4px;
		opacity: .6;
	}
	.nav-display a{
		margin: 8px 0;
	}
	.nav-desc {
		min-height: 100px;
	}
	.nav-desc span{
		font-size: 12px;
		font-weight: bold;
	}
	.btn{
		color: #42b983;
		font-size: 14px;
	}
	.btn-secondary {
		background-color: #ECEFF1;
	}
	.btn-secondary-white {
		background-color: #fff;
	}
	.steps {
		display: none;
	}
</style>
