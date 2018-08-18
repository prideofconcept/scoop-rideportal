export default [
	{
		id: 'activated',
		label: 'Ride Active',
		driverDesc: 'Ride ready, and ready to be started',
		driverButtonTitle: 'Start Ride',
		parentDesc: 'Driver is ready, Driver will navigate to pickup shortly',
	},
	{
		id: 'nav_to_pickup',
		label: 'Navigate to pick-up point',
		driverDesc: 'Click the navigation link, navigate to pickup point',
		parentDesc: 'Drvier is enroute to pickup point'
	},
	{
		id: 'pickup',
		label: 'Pickup',
		driverDesc: 'Pickup child, leave vehicle if necessary',
		parentDesc: 'Driver is ready to pickup child'
	},
	{
		id: 'nav_to_dropoff',
		label: 'Navigate to drop-off point',
		driverDesc: 'Secure child, navigate to drop-off location',
		parentDesc: 'Driver is navigating to destination'
	},
	{
		id: 'dropoff',
		label: 'Drop off child',
		driverDesc: 'Deliver child safely to drop-off point',
		parentDesc: 'Driver has arrived, delivering child to drop-off location'
	},
	{
		id: 'complete',
		label: 'Ride finalized',
		driverDesc: 'Ride has ended',
		driverButtonTitle: 'Complete Ride',
		parentDesc: 'Ride has ended'
	},
];
