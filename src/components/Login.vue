<template>
<div>
	<div class="flex row">
	<div class="col-12 m-4">
		<h1>Please Sign In</h1>
	</div>
	<form class="col-12" v-on:submit.prevent.stop="login">

		<div class="form-group">
		<input
			v-model.trim="email"
			class="form-control"
			type="email"
			placeholder="Email"
			required>
		</div>

		<div class="form-group">
		<input
			v-model.trim="password"
			class="form-control"
			type="password"
			minlength="6"
			placeholder="Password"
			required>
		</div>

		<button type="submit" class="mt-4 btn">Login</button>

	</form>
	</div>
</div>
</template>

<script>
import firebaseApp from '../firebase'
import * as firebase from 'firebase'

export default {
	name: 'Login',
	data () {
		return {
			valid: false,
			password: '',
			passwordRules: [v => !!v || 'Password is required'],
			email: '',
			emailRules: [
				v => !!v || 'E-mail is required',
				v =>
					/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
					'E-mail must be valid'
			]
		}
	},
	methods: {
		login: function (e) {
			firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
				.then(this.loginUser.apply(this))
				.catch(function (error) {
					// Handle Errors here.
					const errorCode = error.code
					const errorMessage = error.message
					// todo: handle error - console.log(errorMessage)
				})
		},
		loginUser: function () {
			firebaseApp.auth().signInWithEmailAndPassword(this.email, this.password)
				.then(
					data => {
						// console.log(`You are logged in as ${data.user.email}`);
						this.$store.dispatch('LOGIN_SUCCESS', data.user)
					},
					err => {
						// todo: handle error -
						console.log('login error:', err.message)
					}
				)
		}
	},
	mounted () {
		console.log('test login component', firebase.auth().currentUser)
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
