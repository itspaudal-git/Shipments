// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvjBF8oP9hhaorrsLU8pr2prCAmS7eXmg",
    authDomain: "shipments-169d4.firebaseapp.com",
    databaseURL: "https://shipments-169d4-default-rtdb.firebaseio.com",
    projectId: "shipments-169d4",
    storageBucket: "shipments-169d4.appspot.com",
    messagingSenderId: "500866362157",
    appId: "1:500866362157:web:9a4ddf3a59173bfc7041a4",
    measurementId: "G-Y3QBFBL0LB"
  };

firebase.initializeApp(firebaseConfig);

// Get a reference to the "Shipments/Data" node in the Firebase database
const expectedRef = firebase.database().ref('Shipments/Data');

// Set up an event listener for the "View Shipment Data" button
const shipmentDataButton = document.getElementById('shipment-data-button');
shipmentDataButton.addEventListener('click', () => {
	// Retrieve the data from the Firebase database
	expectedRef.once('value').then(snapshot => {
		// Convert the data to a JSON object
		const data = snapshot.val();

		// Convert the JSON object to a string
		const dataString = JSON.stringify(data, null, 2);

		// Update the HTML content of the "shipment-data" element
		const shipmentDataElement = document.getElementById('shipment-data');
		shipmentDataElement.innerHTML = `<pre>${dataString}</pre>`;
	});
});

// Update the "Total" label with the total number of expected barcodes
expectedRef.once('value').then(snapshot => {
	const total = snapshot.numChildren();
	document.getElementById('total').innerText = total;
});

// Update the "Scanned" label with the number of scanned barcodes
const scannedRef = firebase.database().ref('Shipments/Scanned');
scannedRef.on('value', snapshot => {
	const scanned = snapshot.numChildren();
	document.getElementById('scanned').innerText = scanned;
});