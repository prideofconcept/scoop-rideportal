<template>
	<div>
	<h1>Please Sign In</h1>
	<v-form v-model="valid">

		<v-text-field
			label="email"
			v-model="email"
			:rules="emailRules"
			required
		></v-text-field>

		<v-text-field
			label="Password"
			v-model="password"
			:counter="10"
			type="password"
			required
		></v-text-field>

	</v-form>
	</div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
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
