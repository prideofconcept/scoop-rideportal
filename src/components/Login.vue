<template>
<v-layout>
	<v-flex xs12 >
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
			:rules="passwordRules"
			:counter="10"
			type="password"
			required
		></v-text-field>

		<v-btn v-on:click="login" >Login</v-btn>

	</v-form>
	</v-flex>
</v-layout>
</template>

<script>
import firebase from '../firebase'

export default {
	name: 'Login',
	data () {
		return {
			valid: false,
			password: '',
			passwordRules: [
				v => !!v || 'Password is required'
			],
			email: '',
			emailRules: [
				v => !!v || 'E-mail is required',
				v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
			]
		}
	},
	methods: {
		login: function (e) {
			firebase
				.auth()
				.signInWithEmailAndPassword(this.email, this.password)
				.then(
					user => {
						console.log(`You are logged in as ${user.email}`)
						this.$store.dispatch('LOGIN_SUCCESS', user)
						this.$router.push('/')
					},
					err => {
						console.log('login error:', err.message)
					}
				)
			e.preventDefault()
		},
		mounted () {
			console.log('test')
			// this.$store.dispatch('GET_CALRIDES', {$getGapiClient: this.$getGapiClient})
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
