<template>

	<div id="CurrentRideView" class="col-12 white--text my-4 p-4" v-if="currentRide">
		<h6 class="headline">Current Ride</h6>
		<div class="row">
			<div class="col-12">
				<h6 class="text-center">{{currentRide.summary}}</h6>
				<p>status: </p>
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

		<div class="row">
			<div class="col-6">
				<p class=""><i class="oi oi-data-transfer-download mr-2"></i>pickup:<br/> {{currentRide.location}}
					<a class="btn btn-small btn-inverted" v-bind:href="pickupHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to pickup</a>
				</p>
			</div>
			<div class="col-6">
				<p>
					<i class="oi oi-data-transfer-upload mr-2"></i>drop-off:<br/> <span v-html="currentRide.description"></span>
					<a class="btn btn-small btn-inverted" v-bind:href="dropoffHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to {{destination}}destination</a>
				</p>
			</div>
			<p>notes:</p>
		</div>

		<div class="white--text">
			<button v-on:click.prevent="onStopRide" class="btn btn-light">Finish Ride</button>
		</div>
	</div>

</template>

<script>
	import * as firebase from 'firebase'

	import Firestore from '@/firebase/firestore'
	const currentRideCollection = Firestore.collection('ride_current') // todo: s houdl the collections be exported from the firebase module

export default {
	props: {
	},
	data () {
		return {
			step_pickup: true,
		}
	},
	computed: {
		currentRide () {
			return this.$store.state.ride.currentRide
		},
		destination() {return this.currentRide.description},
		pickupHref () { return `http://maps.google.com/?daddr=${this.currentRide.location}` },
		dropoffHref () { return `http://maps.google.com/?daddr=${this.currentRide.description}` },
	},
	methods: {
		onStopRide: function (e) {
			// throw up a warning before allowing this action
			this.$store.dispatch('stopRide', this.currentRide)
		},
		handleCurrentRideUpdate: function(querySnapshot) {

			querySnapshot.docChanges().forEach(function(change) {
				if (change.type === "removed") {
					this.$store.dispatch('SET_CURRRIDE', null)
					return
				}
			}.bind(this))

			if(querySnapshot.empty || querySnapshot.docs.length <= 0) {
				return
			}

			querySnapshot.forEach(function (doc) {
				const currentRide = doc.data()
				this.$store.dispatch('SET_CURRRIDE', currentRide)
			}.bind(this))
		}
	},
	mounted () {
		console.log('asking for current')
		currentRideCollection
			.where('guardian', '==',firebase.auth().currentUser.email )
			.onSnapshot(this.handleCurrentRideUpdate.bind(this),
				(error) => { console.log("Error getting documents: ", error);})

		currentRideCollection
			.where('driver', '==', firebase.auth().currentUser.email)
			.onSnapshot(this.handleCurrentRideUpdate.bind(this),
				(error) => { console.log("Error getting documents: ", error);})

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

	a {
		color: #42b983;
	}

	.steps {
		display: none;
	}
</style>
