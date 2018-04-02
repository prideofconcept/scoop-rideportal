<template>
<v-app>
	<v-navigation-drawer app></v-navigation-drawer>
	<v-content>
	<v-container id="app" fluid >

		<img src="./assets/logo.png">
		<v-spacer></v-spacer>
		<router-view/>

	</v-container>
	</v-content>
</v-app>
</template>

<script>
export default {
	name: 'App'
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
</style>
