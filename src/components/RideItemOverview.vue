<template>

	<div class="row my-3" v-bind:class="{ selected : isSelecteder}">
		<div class="row ml-2 item-detail" @click="onSelected">
			<p class="col-12 px-3 headline text-left" >{{ride.summary}}</p>
			<p class="col-12 px-3 small text-left">{{rideStartTime}}</p>
		</div>

		<div class="col-12 white--text" v-show="(isSelecteder && isDriver)">
			<i class="oi oi-media-play"></i>
			<button v-on:click.prevent="onStartRide" v-if="!isCurrentRide">Select Ride</button>
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
		isDriver () {
			return this.$store.state.account.isDriver
		},
		rides () {
			return this.$store.state.events
		},
		rideStartTime () {
			return this.formatDate(new Date(this.ride.startdate))
		}
	},
	methods: {
		onSelected: function (e) {
			this.isSelecteder = !this.isSelecteder
		},
		onStartRide: function (e) {
			console.log('click', this.ride.id)
			this.$store.dispatch('startRide', this.ride)
			this.isCurrentRide = true
		},
		onDeactivateRide: function (e) {
			// throw up a warning before allowing this action
			this.$store.dispatch('stopRide', this.ride)
			this.isCurrentRide = false
		},
		formatDate: function (date) {
			var monthNames = [
				'January', 'February', 'March',
				'April', 'May', 'June', 'July',
				'August', 'September', 'October',
				'November', 'December'
			]

			var day = date.getDate()
			var monthIndex = date.getMonth()
			var year = date.getFullYear()
			return date.toLocaleString('en-US', { timeZone: 'America/New_York' })
			// return day + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
		},
	},
	created () {
	}
}
</script>

<style  scoped>
	.headline {
		font-weight: bold;
		color: #135669;
		font-size: 14px;
	}
	p {font-size: 11px;}
	.headline .oi {
		top:4px;
		color: #ddd;
	}
	.item-detail {
		border-left: 2px #777 solid;
	}
	.selected.item-detail{
		border-color: #e93293;
	}
	.selected .oi {
		color: #039be5;
	}

	a {
		color: #42b983;
	}

</style>
