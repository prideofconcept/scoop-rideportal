<template>
<div id="app" class="container">
	<img class="logo p-5" src="./assets/scoop-handmark.png">
	<router-view/>
</div>
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

	.logo {
		max-width: 250px;
	}
</style>
