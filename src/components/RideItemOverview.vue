<template>

	<div class="col-12 white--text my-4">
		<h4 class="col-12 headline" @click="onSelected"><i class="oi oi-chevron-right"></i>{{ride.summary}}</h4>

		<div class="col-12 white--text" v-show="isSelecteder">
			<i class="oi oi-media-play"></i>
			<button v-on:click.prevent="onStartRide" v-if="!isCurrentRide">Start Ride</button>
			<button v-on:click.prevent="onStopRide" v-if="isCurrentRide">Finish Ride</button>
		</div>
	</div>

</template>

<script>
export default {
	props: {
		ride: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			isCurrentRide: false,
			isSelecteder: false,
		}
	},
	computed: {
		rides () {
			return this.$store.state.events
		}
	},
	methods: {
		onSelected: function(e) {
			this.isSelecteder = !this.isSelecteder
			console.log(e.currentTarget.classList.toggle('selected'))
		},
		onStartRide: function (e) {
			console.log('click', this.ride.id)
			this.$store.dispatch('startRide', this.ride)
			this.isCurrentRide = true
		},
		onStopRide: function (e) {
			// throw up a warning before allowing this action
			this.$store.dispatch('stopRide', this.ride)
			this.isCurrentRide = false
		}
	},
	created () {
	}
}
</script>

<style  scoped>
	.headline .oi {
		top:4px;
		color: #ddd;
	}
	.headline.selected .oi {
		color: #039be5;
	}

	a {
		color: #42b983;
	}


</style>
