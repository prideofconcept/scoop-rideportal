<template>
<div>
	<div class="flex row" >
	<h1>Please Sign In</h1>
	<form v-on:submit.prevent.stop="login">

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

		<button type="submit" >Login</button>

	</form>
	</div>
</div>
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
					data => {
						console.log(`You are logged in as ${data.user.email}`)
						this.$store.dispatch('LOGIN_SUCCESS', data.user)
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
