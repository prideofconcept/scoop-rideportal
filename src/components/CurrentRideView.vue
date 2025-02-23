<template>

	<div id="CurrentRideView" class="col-12 white--text my-4 p-4" v-if="currentRide">
		<h6 class="headline">Current Ride</h6>
		<div class="row">
			<div class="col-12">
				<h6 class="text-center">{{currentRide.summary}}</h6>
				<p v-if="currentStep">status: {{currentStep.label}} </p>
				<google-map/>
			</div>
		</div>

		<section id="rideOverview" class="row">
			<div class="col-6">
				<div class="nav-display">
					<p class="nav-desc"><span><i class="oi oi-data-transfer-download mr-2"></i>pickup:</span><br/> {{currentRide.location}}</p>
				</div>
			</div>
			<div class="col-6">
				<div class="nav-display">
					<p class="nav-desc"><span><i class="oi oi-data-transfer-upload mr-2"></i>drop-off:</span><br/> {{currentRide.destination}}</p>
				</div>
			</div>
		</section>

		<section class="row steps pb-4" v-show="isDriver">

			<hr class="divider"/>

			<div class="col-12" v-if="currentStep">
				<div class="text-center">
					<h6 class="text-uppercase"><i class="oi oi-arrow-right-angle"></i>{{currentStep.label}}</h6>
					<p class="text-secondary m-0">{{currentStep.id}}</p>
					<p class="font-weight-bold"><i class="oi oi-arrow-right-angle"></i>{{isDriver ? currentStep.driverDesc : currentStep.parentDesc}}</p>
				</div>
			</div>
			<div class="col-12" v-if="currentStep && currentStep.id === 'nav_to_pickup'">
					<a class="btn btn-small btn-secondary" v-bind:href="pickupHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to pickup</a>
					<a class="btn btn-small btn-secondary-white" v-bind:href="pickupWaze" target="_blank"><i class="oi oi-location mr-2"></i>waze</a>
			</div>
			<div class="col-12" v-if="currentStep && currentStep.id === 'nav_to_dropoff'">
				<p class="m-0">Check Safety and Start Navigation</p>
				<br/>
				<a class="btn btn-small btn-secondary" v-bind:href="dropoffHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to dest</a>
				<a class="btn btn-small btn-secondary-white" v-bind:href="dropoffWaze" target="_blank"><i class="oi oi-location mr-2"></i>waze</a>
			</div>
			<div class="col-12">
				<br/>
				<button class="btn btn-light text-center" v-on:click.prevent="onNextStep">
					<h4 v-if="currentStep"><i class="oi oi-chevron-right">&nbsp;</i>{{currentStep.driverButtonTitle ? currentStep.driverButtonTitle : 'Next Step'}}</h4>
				</button>
			</div>
		</section>

		<div id="rideControlPanel" class="row" v-show="isDriver">
			<div class="col-12">
				<p>notes:</p>
				<p>{{currentRide.description}}</p>
				<hr/>
				<div>
					<button v-if="currentStep" v-on:click.prevent="onDeactivateRide" class="btn btn-error btm-small" :disabled="currentStep.isLastStep">Deactivate Ride</button>
					<button v-if="currentStep.isLastStep" v-on:click.prevent="onRestartRide" class="btn btn-error btm-small" :disabled="!currentStep.isLastStep">Restart Ride</button>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
import * as firebase from 'firebase'
import Firestore from '@/firebase/firestore'
import GoogleMap from '@/components/GoogleMaps'
import { stepsOfService, getStepFromId } from '@/data/stepsOfService'
import { mapState } from 'vuex'

const currentRideCollection = Firestore.collection('ride_current') // todo: should the collections be exported from the firebase module

export default {
	components: {
		GoogleMap
	},
	props: {
	},
	data () {
		return {
			getStepFromId: getStepFromId,
			stepsOfService: stepsOfService,
			step_pickup: true,
			testData: true,
			gpsInterval: null,
			currentStep: getStepFromId( this.currentRide && this.currentRide.currentStep ? this.currentRide.currentStep : 'activated'),
		}
	},
	computed: {
		// currStep () {return stepsOfService[currentStepIndx]},
		pickupHref () { return `http://maps.google.com/?daddr=${this.currentRide.location}` },
		dropoffHref () { return `http://maps.google.com/?daddr=${this.currentRide.destination}` },
		pickupWaze () { return `https://waze.com/ul?q=${encodeURIComponent(this.currentRide.location)}` },
		dropoffWaze () { return `https://waze.com/ul?q=${encodeURIComponent(this.currentRide.destination)}` },
		...mapState({
			currentRide: state => state.ride.currentRide,
			isDriver: state => state.account.isDriver,
		})
	},
	watch: {
		currentStep: function (newStep, oldStep) {
			console.log('watch:step has changed to', newStep)
			if(this.isDriver && newStep && newStep.isTrackGPS) {
				if(!this.gpsInterval) {
					this.gpsInterval = setInterval(this.getDeviceCurrentGPSLocation, 30000)
				}
			} else {
				clearInterval(this.gpsInterval)
			}
		},
		currentRide: {
			handler (newCurrentRide, oldCurrentRide) {
				console.log('watch:currentRide has changed', newCurrentRide.currentStep, oldCurrentRide ? oldCurrentRide.currentStep : null)
				if( (!oldCurrentRide && newCurrentRide.currentStep) ||
					(newCurrentRide.currentStep && newCurrentRide.currentStep !== this.currentStep.id) ) {
					console.log('watch:currentStepID has changed')
					this.currentStep = this.getStepFromId( newCurrentRide.currentStep ) || this.stepsOfService[0]
				}
			},
			deep: true},
	},
	methods: {
		onDeactivateRide: function (e) {
			// throw up a warning before allowing this action
			const r = confirm('Deactivate Ride?! - this is not the normal process to end a ride')
			if(!r) return

			this.stopCurrentRide()
		},
		onRestartRide: function (e) {
			// throw up a warning before allowing this action
			const r = confirm('Restart Ride?! - this is not the normal process to end a ride')
			if(!r) return

			this.$store.dispatch('SET_CURRENT_STEP', this.stepsOfService[0].id)
		},
		onNextStep: function (e) {
			if ( !this.currentStep.isLastStep) {
				const nextStep = this.stepsOfService[this.currentStep.index + 1]
				this.$store.dispatch('SET_CURRENT_STEP', nextStep.id)
			} else if (this.currentStep.isLastStep) {
				this.stopCurrentRide()
			}
		},
		stopCurrentRide: function () {
			// this.currentStep = null
			this.$store.dispatch('STOP_CURRENT_RIDE')
		},
		handleCurrentRideUpdate: function (querySnapshot) {
			if(querySnapshot.empty || querySnapshot.docs.length <= 0) {
				return
			}

			const changes = querySnapshot.docChanges()
			changes.forEach((change, idx, array) => {
				if( change.doc.metadata.hasPendingWrites ) {
					return
				}
				console.log('change change', change.doc.metadata.hasPendingWrites)

				if (change.type === 'removed') {
					console.log('removed')
					this.$store.dispatch('SET_CURRRIDE', null)
				}
				else if (change.type === 'modified') {

					const updatedRide = change.doc.data()

					if(!updatedRide || change.doc.id !== this.currentRide.id) {
						console.error('id changed while on currentRide')
						// todo: log this
						return
					}

					// this is a legitimate change - lets work with it

					// todo check if location/current_locale changed
					if( updatedRide.current_locale &&
						(!this.currentRide.current_locale ||
							updatedRide.current_locale.lat !== this.currentRide.current_locale.lat ||
							updatedRide.current_locale.lng !== this.currentRide.current_locale.lng) ) {
						console.log('currentRide:change - locale')
						// this.currentRide.current_locale = updatedRide.current_locale
						this.$store.dispatch('CURRRIDE_UPDATED', {current_locale: updatedRide.current_locale})
						// todo if not local change ignore ?
					}

					// check if ride status/currentStep changed
					if( updatedRide.currentStep && updatedRide.currentStep !== this.currentRide.currentStep ) {
						console.log('currentRide:change - currentStep', (updatedRide.currentStep !== this.currentRide.currentStep), this.currentRide.currentStep, updatedRide.currentStep)
						/* if(!this.isDriver) {
							this.currentRide.currentStep = getStepFromId(updatedRide.currentStep)
						} */
						this.$store.dispatch('CURRRIDE_UPDATED', {currentStep: updatedRide.currentStep})

						// todo if not local change update currentEvent in state?
					}
				}
				else if (change.type === 'added') {
					const currRide = change.doc.data()
					console.log('change - currRide, self, this', currRide)
					this.$store.dispatch('SET_CURRRIDE', currRide)
					if( this.isDriver ) {
						if(navigator.geolocation) {
							try{
								this.getDeviceCurrentGPSLocation()
							} catch(e) {
								console.log('navigator error', e)
							}
						}
						else {
							alert('navigator.geolocation is not available')
						}
					}
				}
			})

		},
		getDeviceCurrentGPSLocation: function () {
			navigator.geolocation.getCurrentPosition(this.onPositionUpdate)
		},
		onPositionUpdate: function (position) {

			if(position.coords) {
				var lat = position.coords.latitude
				var lng = position.coords.longitude
				if (this.$store) {
					console.log('updating pos')
					this.$store.dispatch('SET_CURRRIDE_LOCATION', { lat, lng })
				}
			}
		},
	},
	mounted () {
		const queryContraint = this.isDriver ? 'driver_flat' : 'guardian_flat'
		console.log('asking for current ride', this.isDriver, queryContraint)

		// todo: make sure we only calculate this, once app has loaded, and in a more global place
		currentRideCollection
			.where(queryContraint, 'array-contains', firebase.auth().currentUser.email )
			.onSnapshot(this.handleCurrentRideUpdate.bind(this),
				(error) => {
					console.log('Error getting documents: ', error)
				})

	},
	updated () {

	}
}
</script>

<style scoped>
	#CurrentRideView{
		background-color: #bfe3d4;
	}
	.headline {
		font-weight: bold;
		text-transform: uppercase;
	}

	#rideOverview p{
		font-size: 12px;
	}

	.hide {display: none;}
	p {font-size: 14px;}
	.oi {
		top: 4px;
		opacity: .6;
	}
	hr.divider {
		border: 3px #000 solid;
		width: 100%;
		opacity: 0.1;
		margin-top: 0;
	}
	.nav-display{
		margin: 8px 0;
	}
	.nav-desc {
		/*min-height: 80px;*/
	}
	.nav-desc span{
		font-size: 12px;
		font-weight: bold;
	}
	button h4{margin: 0;}
	button h4 i{font-size: 16px;line-height: 24px;top:0 !important;}
	.btn{
		color: #42b983;
		font-size: 14px;
	}
	.btn-error {
		background-color: #cc0000;
		color:#fff;
		font-weight: bold;
		font-size: 12px;
		text-transform: uppercase;
		padding: 5px 26px;
	}
	.btn-secondary {
		background-color: #ECEFF1;
	}
	.btn-secondary-white {
		background-color: #fff;
	}
</style>
