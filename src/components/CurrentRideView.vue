<template>

	<div id="CurrentRideView" class="col-12 white--text my-4 p-4">
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
					<button class="btn btn-small" v-bind:href="pickupHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to pickup</button>
				</p>
			</div>
			<div class="col-6">
				<p><i class="oi oi-data-transfer-upload mr-2"></i>drop-off:<br/> <span v-html="currentRide.description"></span>
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
export default {
	props: {
	},
	data () {
		return {
			step_pickup: true
		}
	},
	computed: {
		currentRide () {
			return this.$store.state.ride.currentRide
		},
		pickupHref () { return `http://maps.google.com/?daddr=${this.currentRide.location}` },
		dropoffHref () { return `http://maps.google.com/?daddr=${this.currentRide.description}` },
	},
	methods: {
		onStopRide: function (e) {
			// throw up a warning before allowing this action
			this.$store.dispatch('stopRide', this.currentRide)
		}
	},
	created () {
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
</style>
