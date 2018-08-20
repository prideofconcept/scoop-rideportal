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
					<p class="nav-desc"><span><i class="oi oi-data-transfer-upload mr-2"></i>drop-off:</span><br/> {{currentRide.description}}</p>
				</div>
			</div>
		</section>

		<section class="row steps pb-4" v-show="isDriver">
			<div class="col-12" v-if="currentStep">
				<div class="text-center">
					<h6 class="text-uppercase"><i class="oi oi-arrow-right-angle"></i>{{currentStep.label}}</h6>
					<p class="font-weight-bold"><i class="oi oi-arrow-right-angle"></i>{{isDriver ? currentStep.driverDesc : currentStep.parentDesc}}</p>
				</div>
			</div>
			<div class="col-12" v-show="currentStep.id === 'nav_to_pickup'">
					<a class="btn btn-small btn-secondary" v-bind:href="pickupHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to pickup</a>
					<a class="btn btn-small btn-secondary-white" v-bind:href="pickupWaze" target="_blank"><i class="oi oi-location mr-2"></i>waze</a>
			</div>
			<div class="col-12" v-show="currentStep.id === 'nav_to_dropoff'">
				<p class="m-0">Check Safety and Start Navigation</p>
				<br/>
				<a class="btn btn-small btn-secondary" v-bind:href="dropoffHref" target="_blank"><i class="oi oi-location mr-2"></i>nav to dest</a>
				<a class="btn btn-small btn-secondary-white" v-bind:href="dropoffWaze" target="_blank"><i class="oi oi-location mr-2"></i>waze</a>
			</div>
			<div class="col-12">
				<br/>
				<button class="btn btn-light text-center" v-on:click.prevent="onNextStep">
					<h4><i class="oi oi-chevron-right">&nbsp;</i>{{currentStep.driverButtonTitle ? currentStep.driverButtonTitle : 'Next Step'}}</h4>
				</button>
			</div>
		</section>

		<div id="rideControlPanel" class="row" v-show="isDriver">
			<div class="col-12">
				<p>notes:</p>
				<p>{{currentRide.description}}</p>
				<hr/>
				<div>
					<button v-on:click.prevent="onDeactivateRide" class="btn btn-error btm-small" :disabled="currentStep.id === 'complete'">Deactivate Ride</button>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
import * as firebase from 'firebase'
import Firestore from '@/firebase/firestore'
import GoogleMap from '@/components/GoogleMaps'
import { stepsOfService, getStepFromId} from '@/data/stepsOfService'
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
			stepsOfService: stepsOfService,
			currentStep: null,
			step_pickup: true,
			testData: true
		}
	},
	computed: {
		// currStep () {return stepsOfService[currentStepIndx]},
		pickupHref () { return `http://maps.google.com/?daddr=${this.currentRide.location}` },
		dropoffHref () { return `http://maps.google.com/?daddr=${this.currentRide.destination}` },
		pickupWaze () { return `https://waze.com/ul?q=${encodeURIComponent(this.currentRide.location)}` },
		dropoffWaze () { return `https://waze.com/ul?q=${encodeURIComponent(this.currentRide.destination)}` },
		//isRideActive (){ return this.currentStep.id === 'complete'},
		...mapState({
			currentRide: state => state.ride.currentRide,
			isDriver: state => state.account.isDriver,
		})
	},
	methods: {
		onDeactivateRide: function (e) {
			// throw up a warning before allowing this action
			const r = confirm('Deactivate Ride?! - this is not the normal process to end a ride')
			if(!r) return

			this.stopCurrentRide()
		},
		onNextStep: function (e) {
			if(this.currentStep) {
				if ( !this.currentStep.isLastStep) {
					this.currentStep = this.stepsOfService[this.currentStep.index + 1]
					this.$store.dispatch('SET_CURRENT_STEP', this.currentStep.id)
				} else if (this.currentStep.isLastStep || this.currentStep.id === 'complete') {
					this.stopCurrentRide()
				}
			}
		},
		stopCurrentRide: function () {
			this.currentStep = null
			this.$store.dispatch('STOP_CURRENT_RIDE')
		},
		handleCurrentRideUpdate: function (querySnapshot) {

			const changes = querySnapshot.docChanges()
			changes.forEach((change, idx, array) => {
				if (change.type === 'removed') {
					this.$store.dispatch('SET_CURRRIDE', null)
				}
				else if (change.type === 'modified') {

					const updatedRide = change.doc.data()

					if(!updatedRide || change.doc.id !== this.currentRide.id) {
						console.error('id changed while on currentRide')
						// todo: log this
						return
					}

					console.log(change)
					// todo check if location/current_locale changed
					if( updatedRide.current_locale && updatedRide.current_locale !== this.currentRide.current_locale )
					{
						console.log('currentRide:change - locale', (updatedRide.current_locale !== this.currentRide.current_locale), this.currentRide.current_locale, updatedRide.current_locale)
						this.currentRide.current_locale = updatedRide.current_locale
						//todo if not local change ignore ?
					}

					// check if ride status/currentStep changed
					if( updatedRide.currentStep && updatedRide.currentStep !== this.currentRide.currentStep )
					{
						console.log('currentRide:change - currentStep', (updatedRide.currentStep !== this.currentRide.currentStep), this.currentRide.currentStep, updatedRide.currentStep)
						this.currentRide.currentStep = getStepFromId(updatedRide.currentStep)
						//todo if not local change update currentEvent in state?
					}
				}
				else if (change.type === 'added') {
					const currRide = change.doc.data()
					console.log('change - currRide, self, this',currRide)
					this.currentStep = currRide.currentStep ? getStepFromId(currRide.currentStep) : this.stepsOfService[0]
					this.$store.dispatch('SET_CURRRIDE', currRide)
					if( this.isDriver ) {
						if(navigator.geolocation) {
							try{
								navigator.geolocation.getCurrentPosition(this.onPositionUpdate.bind(this))
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

			if(querySnapshot.empty || querySnapshot.docs.length <= 0) {
				return
			}

		},
		onPositionUpdate: function (position) {

			if(position.coords) {
				var lat = position.coords.latitude
				var lng = position.coords.longitude
				if (this.$store) {
					console.log('this.$store', this.$store)
					this.$store.dispatch('SET_CURRRIDE_LOCATION', { lat, lng })
				}
			}
		}
	},
	mounted () {
		// this.currentStep = this.currentRide.currentStep ? this.currentRide.currentStep : stepsOfService[0]
		const queryContraint = this.isDriver ? 'driver.email' : 'guardian.email'
		console.log('asking for current ride', this.isDriver, queryContraint)

		// todo: make sure we only calculate this, once app has loaded, and in a more global place
		currentRideCollection
			.where(queryContraint, '==', firebase.auth().currentUser.email )
			.onSnapshot(this.handleCurrentRideUpdate.bind(this),
				(error) => {
					console.log('Error getting documents: ', error)
				})

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
	.nav-display{
		margin: 8px 0;
	}
	.nav-desc {
		min-height: 80px;
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
