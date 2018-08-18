export const stepsOfService = [
	{
		id: 'activated',
		index:1,
		label: 'Ride Active',
		driverDesc: 'Ride ready, and ready to be started',
		driverButtonTitle: 'Start Ride',
		parentDesc: 'Driver is ready, Driver will navigate to pickup shortly',
		isServiceActive: false,
	},
	{
		id: 'nav_to_pickup',
		index:2,
		label: 'Navigating to pick-up point',
		driverDesc: 'Click the navigation link, navigate to pickup point',
		parentDesc: 'Drvier is enroute to pickup point',
		isServiceActive: false,
	},
	{
		id: 'pickup',
		index:3,
		label: 'Pickup : Meeting Child',
		driverDesc: 'Pickup child, leave vehicle if necessary',
		parentDesc: 'Driver is ready to pickup child',
		isServiceActive: false,
	},
	{
		id: 'nav_to_dropoff',
		index:4,
		label: 'Driving Child to drop-off point',
		driverDesc: 'Secure child, navigate to drop-off location',
		parentDesc: 'Driver is navigating to destination',
		isServiceActive: true,
	},
	{
		id: 'dropoff',
		index:5,
		label: 'Droping off child',
		driverDesc: 'Deliver child safely to drop-off point',
		parentDesc: 'Driver has arrived, delivering child to drop-off location',
		isServiceActive: true,
	},
	{
		id: 'complete',
		index:6,
		label: 'Ride finalized',
		driverDesc: 'Ride has ended',
		driverButtonTitle: 'Complete Ride',
		parentDesc: 'Ride has ended',
		isServiceActive: false,
		isLastStep: true
	},
];

export const getStepFromId = (id) => {
	return stepsOfService.filter((step) => (step.id === id))[0]
}
