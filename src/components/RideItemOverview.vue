<template>

	<div color="blue-grey darken-2" class="white--text mb-4">
		<div class="row">
			<h2 class="headline">{{ride.summary}}</h2>
		</div>
		<div class="row">
			<p>pickup: {{ride.location}}
				<button  small flat dark v-bind:href="pickupHref" target="_blank"><i>navigation</i></button>
			</p>
			<p>drop-off: <span v-html="ride.description"></span>
				<button samll flat dark v-bind:href="dropoffHref" target="_blank"><i>near_me</i></button>
			</p>
			<p>notes:</p>
		</div>
		<div class="white--text">
			<button block >Start Ride</button>

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
	},
	created () {
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
	font-weight: bold;
}

a {
	color: #42b983;
}
</style>
