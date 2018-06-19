<template>

	<div id="CurrentRideView" class="col-12 white--text my-4 p-4">
		<h2 class="headline">Current Ride</h2>
		<div class="row">
			{{currentRide.summary}}
		</div>
		<div class="white--text">
			<button >Start Ride</button>

		</div>
	</div>

</template>

<script>
export default {
	props: {
	},
	data () {
		return {
		}
	},
	computed: {
		currentRide () {
			return this.$store.state.ride.currentRide
		},
	},
	methods: {
		onStartRide: function (e) {
			console.log('click', this.ride.id)
			this.$store.dispatch('startRide', this.ride)
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
h1, h2 {
	font-weight: bold;
}

a {
	color: #42b983;
}
</style>
