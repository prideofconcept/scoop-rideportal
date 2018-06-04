<template>

	<div class="col-12 white--text my-4">
		<h2 class="headline">{{ride.summary}}</h2>
		<div class="row">
			<p>pickup: {{ride.location}}
				<button class="btn btn-small" v-bind:href="pickupHref" target="_blank"><i>navigation</i></button>
			</p>
			<p>drop-off: <span v-html="ride.description"></span>
				<button class="btn btn-small" v-bind:href="dropoffHref" target="_blank"><i>near_me</i></button>
			</p>
			<p>notes:</p>
		</div>
		<div class="white--text">
			<button v-on:click.prevent="onStartRide">Start Ride</button>

		</div>
	</div>

</template>

<script>
export default {
	props: {
		ride: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
		}
	},
	computed: {
		rides () {
			return this.$store.state.events
		},
		pickupHref () { return `http://maps.google.com/?daddr=${this.ride.location}` },
		dropoffHref () { return `http://maps.google.com/?daddr=${this.ride.description}` }

	},
	methods: {
		onStartRide: function(e){
			console.log('click')
			this.$store.dispatch('startRide');
		}
	},
	created () {
	}
}
</script>

<style scoped>
h1, h2 {
	font-weight: bold;
}

a {
	color: #42b983;
}
</style>
