<template>
<div>
<h1>{{ msg }}</h1>
<h2>Calendar Events</h2>
<ul>
<li v-for="item in events">
    {{ item.summary }}
  </li>

</ul>

</div>
</template>

<script>
export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: 'Welcome to Your Vue.js App!',
			events: this.$store.getters.events
		}
	},
	computed: {
		userIsAuthenticated () {
			return this.$store.getters.user !== null
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
