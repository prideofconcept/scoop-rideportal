<template>
<v-layout>
	<v-flex xs12 sm6 offset-sm3>
		<h1>Upcoming Rides</h1>
		<h3>{{ msg }}</h3>
		<v-card :key="item.id" v-for="item in events">
		    {{ item }}
			<v-card-title>
				<h2>{{item.summary}}</h2>
			</v-card-title>
			<v-card-text>
				<p></p>
			</v-card-text>
			<!--<v-card-actions>-->
				<!--<v-btn xs12 flat>Start Ride</v-btn>-->
				<!--<v-btn flat>Nav:Pickup</v-btn>-->
				<!--<v-btn flat>Nav:Drop-Off</v-btn>-->
			<!--</v-card-actions>-->
		</v-card>
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
		events () {
			return this.$store.state.events
		}
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
