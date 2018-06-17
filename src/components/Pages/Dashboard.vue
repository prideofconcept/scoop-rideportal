<template>
<div class="row">
	<div class="col-12">
		<h1>Dashboard</h1>
		<h5>{{ msg }}</h5>
		<div class="row">
			<CurrentRideView/>
		</div>
		<h3>Upcoming Rides</h3>
		<div class="row">
			<ride-item-overview v-for="ride in rides" v-bind:key="ride.id" v-bind:ride="ride"></ride-item-overview>
		</div>
	</div>

</div>
</template>

<script>
import RideItemOverview from '../RideItemOverview'
import CurrentRideView from '../CurrentRideView'
export default {
	components: {RideItemOverview, CurrentRideView},
	name: 'HelloWorld',
	data () {
		return {
			msg: `${this.$store.getters.user.displayName || this.$store.getters.user.email}`
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
		this.$store.dispatch('GET_CALRIDES_FIREBASE')
		// this.$store.dispatch('GET_CALRIDES', {$getGapiClient: this.$getGapiClient})
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
