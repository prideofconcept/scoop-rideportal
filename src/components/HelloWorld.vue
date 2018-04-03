<template>
<div>
	<h1>Upcoming Rides</h1>
	<h3>{{ msg }}</h3>
	<ul>
	<li :key="item.id" v-for="item in events">
	    {{ item }}
	</li>

	</ul>

</div>
</template>

<script>
export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: `${this.$store.getters.user.displayName} :: here are your rides`,
		}
	},
	computed: {
		userIsAuthenticated () {
			return this.$store.getters.user !== null
		},
		events () {
			return this.$store.state.events
		}
	},
	created () {
		this.$store.dispatch('GET_EVENTS', {$getGapiClient: this.$getGapiClient})
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
