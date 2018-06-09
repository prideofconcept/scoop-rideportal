<template>
<div id="app" class="container">
	<img class="logo p-5" src="./assets/scoop-handmark.png">
	<router-view/>
</div>
</template>

<script>
import firebase from '@/firebase/'
export default {
	name: 'App',
	mounted () {
		// todo consider doing user login check here
		const user = firebase.auth().currentUser;
	},
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

	.logo {
		max-width: 250px;
	}
</style>
