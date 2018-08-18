<template>
  <div>
    <div>
      <h4>Ride Current Location</h4>
    </div>
    <br>
    <gmap-map
	    :center="center"
	    :zoom="12"
	    style="width:100%;  height: 400px;"
    >
      <gmap-marker
		:key="index"
		v-for="(m, index) in markers"
		:position="m.position"
		@click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
export default {
	name: "GoogleMap",
	data () {
		return {
			// default to Montreal to keep it simple
			// change this to whatever makes sense
			center: { lat: 29.9511, lng: 90.07 },
			places: [],
			currentPlace: null
		}
	},
	computed: {
		google: gmapApi,
		//geocoder: this.google ? new this.google.maps.Geocoder() : null,

		currentRide () { return this.$store.state.ride.currentRide },
		pickup () { return this.currentRide.location },
		destination () { return this.currentRide.destination },
		markers () { return [
			{ /*position:this.getLatLng(this.pickup),*/ latlng: { lat: 33.753746, lng: -84.386330 } },
			{ /*position:this.getLatLng(this.destination),*/ latlang: { lat: 33.8463, lng: -84.362 } },
		]}
	},
	mounted () {
		this.geolocate()
		console.log('markers', this.pickup, this.destination)
		//this.geocoder = new this.google.maps.Geocoder()
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
		geolocate: function () {
			navigator.geolocation.getCurrentPosition(position => {
				this.center = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
			})
		},
		getLatLng: function (address) {

			if (address === null || address === undefined || !this.google || !this.geocoder)
				return null
			this.geocoder.geocode( { 'address': address }, function (results, status) {
				debugger
				if (status === this.google.maps.GeocoderStatus.OK) {
					/* map.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					}); */
					return results[0].geometry.location
				} else {
					console.error('Geocode was not successful for the following reason: ' + status)
				}
			})
		}
	}
}
</script>
