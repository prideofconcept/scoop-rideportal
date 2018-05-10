<template>

	<v-card color="blue-grey darken-2" class="white--text mb-4">
		<v-card-title>
			<h2 class="headline">{{ride.summary}}</h2>
		</v-card-title>
		<v-card-text>
			<p>pickup: {{ride.location}}
				<v-btn  small flat dark v-bind:href="pickupHref" target="_blank"><v-icon>navigation</v-icon></v-btn>
			</p>
			<p>drop-off: <span v-html="ride.description"></span>
				<v-btn samll flat dark v-bind:href="dropoffHref" target="_blank"><v-icon>near_me</v-icon></v-btn>
			</p>
			<p>notes:</p>
		</v-card-text>
		<v-card-actions class="white--text">
			<v-btn block >Start Ride</v-btn>

		</v-card-actions>
	</v-card>

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
