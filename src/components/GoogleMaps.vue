<template>
  <div class="d-flex flex-column align-items-center">
    <div>
      <p class="text-secondary m-0">live location</p>
    </div>
    <gmap-map
		:center="center"
		:zoom="12"
		v-bind:class="{fullMapView: !isDriver, driverMapView : isDriver}"
		ref="gmap"
		:options="{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}"
    >
      <gmap-marker
	      :key="index"
	      v-for="(m, index) in markers"
	      :position="m.position"
	      @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
	  <!--icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"-->
	  <!-- <gmap-circle :center="center" :radius="200" :options="currentLocaleCircleOption"> </gmap-circle> -->
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
import { mapState } from 'vuex'

export default {
	name: 'GoogleMap',
	data () {
		return {
			// default to Montreal to keep it simple
			// change this to whatever makes sense
			places: [],
			markers: [],
			currentPlace: null,
			currentLocaleCircleOption: {
				strokeColor: '#135669',
				strokeOpacity: 1,
				strokeWeight: 2,
				fillColor: '#339989',
				fillOpacity: 0.8,
			}
		}
	},
	computed: {
		google: gmapApi,
		pickup () { return this.currentRide.location },
		destination () { return this.currentRide.destination },
		center() {return this.currentRide.current_locale? this.currentRide.current_locale : { lat: 33.753746, lng: -84.386330 }},
		/* markers () { return [
			{ latlng: { lat: 33.753746, lng: -84.386330 } },
			{ latlang: { lat: 33.8463, lng: -84.362 } },
		]}, */
		...mapState({
			currentRide: state => state.ride.currentRide,
			isDriver: state => state.account.isDriver,
		})
	},
	watch: {
		markers: function( newMarkers){
			console.log('watch:markers', newMarkers)
		}
	},
	mounted () {
		// console.log('in map pickup, dest ', this.pickup, this.destination)

		this.$refs.gmap.$mapPromise.then((gmapObject) => {
			this.getLatLng()
		})

	},
	updated () {
		console.log('goodle map comp updated', this.markers)
	},

	methods: {
		// receives a place object via the autocomplete component
		setPlace (place) {
			this.currentPlace = place
		},
		/* addMarker() {
			if (this.currentPlace) {
				const marker = {
					lat: this.currentPlace.geometry.location.lat(),
					lng: this.currentPlace.geometry.location.lng()
				};
				this.markers.push({ position: marker });
				this.places.push(this.currentPlace);
				this.center = marker;
				this.currentPlace = null;
			}
		}, */
		getLatLng: function () {
			if ( (!this.pickup && !this.destination) || !this.google )
				return null

			const geocoder = new this.google.maps.Geocoder()
			const locations = [this.pickup, this.destination]
			const vm = this

			locations.forEach((address, idx) => {
				if(!address)
					return

				geocoder.geocode( { 'address': address }, function (results, status) {
					if (status === this.google.maps.GeocoderStatus.OK) {
						const lat = results[0].geometry.location.lat()
						const lng = results[0].geometry.location.lng()
						// console.log( {lat, lng} )
						vm.markers[idx] = { position: {lat, lng} }
						/* map.setCenter(results[0].geometry.location);
						var marker = new google.maps.Marker({
							map: map,
							position: results[0].geometry.location
						});
						return results[0].geometry.location */
					} else {
						console.error('Geocode was not successful for the following reason: ' + status)
					}
				})
			})

		}
	}
}
</script>

<style scoped>
	.fullMapView {
		width:100%;  height: 400px;
	}
	.driverMapView {
		width:80%;  height: 260px;
	}
</style>
