<template>
<v-layout>
	<v-flex xs12 >
		<h1>Upcoming Rides</h1>
		<h3>{{ msg }}</h3>
		<v-flex xs12>
		<v-card color="blue-grey darken-2" class="white--text mb-4" :key="ride.id" v-for="ride in rides">
			<v-card-title>
				<h2 class="headline">{{ride.summary}}</h2>
			</v-card-title>
			<v-card-text>
				<p>pickup: {{ride.location}} <v-btn small flat color="primary" dark href="http://maps.google.com/?daddr=">Nav</v-btn> </p>
				<p>drop-off: <span v-html="ride.description"></span> </p>
				<p>notes: </p>
			</v-card-text>
			<v-card-actions class="white--text">
				<v-btn block >Start Ride</v-btn>

			</v-card-actions>
		</v-card>
		</v-flex>
	</v-flex>

</v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: `${this.$store.getters.user.displayName} :: here are your rides`,
		}
	},
	computed: {
		rides () {
			return this.$store.state.events
		}
	},
	methods: {
		clickLink () {}
	},
	created () {
		//this.$store.dispatch('GET_CALRIDES', {$getGapiClient: this.$getGapiClient})
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
	font-weight: normal;
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
