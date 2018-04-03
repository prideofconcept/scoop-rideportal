<template>
<div class="hello">
<h1>{{ msg }}</h1>
<h2>Calendar Events</h2>
<ul>
<li>
<a
	href="https://vuejs.org"
	target="_blank"
>
Core Docs
</a>
</li>

</ul>

</div>
</template>

<script>
export default {
	name: 'HelloWorld',
	data () {
		return {
			msg: 'Welcome to Your Vue.js App!'
		}
	},
	computed: {
		userIsAuthenticated () {
			return this.$store.getters.user !== null
		}
	},
	created () {
		this.$getGapiClient().then(gapi => {
			console.log('test',gapi.auth2.getAuthInstance().isSignedIn.get())
			if ( !gapi.auth2.getAuthInstance().isSignedIn.get() ) {
				gapi.auth2.getAuthInstance().signIn();
			}

			gapi.client.calendar.events.list({
				'calendarId': 'primary',
				'timeMin': (new Date()).toISOString(),
				'showDeleted': false,
				'singleEvents': true,
				'maxResults': 10,
				'orderBy': 'startTime'
			}).then(function(response) {
				var events = response.result.items;
				console.log(events);
			});

		})
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
