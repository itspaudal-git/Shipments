document.addEventListener("DOMContentLoaded", function() {
	// Wait for the page to finish loading
	window.onload = function() {
	// Set the default values for the form fields
	document.getElementById("term").value = "327";
	document.getElementById("facility").value = "Chicago";
	document.getElementById("cycle").value = "1";
	document.getElementById("carrier").value = "UPS";
	document.getElementById("meal").value = "4";
	document.getElementById("config").value = "1TB";
	
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var dateString = ("0" + (tomorrow.getMonth() + 1)).slice(-2) + "/" + ("0" + tomorrow.getDate()).slice(-2) + "/" + tomorrow.getFullYear();
	document.getElementById("shipdate").value = dateString;	

  };
  
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	}
	
	// Reference the database to Upload
	var dataRef = firebase.database().ref("Data");
	
	// Get references to form elements
	const carrierSelect = document.querySelector('#carrier');
	const mealSelect = document.querySelector('#meal');
	const configSelect = document.querySelector('#config');
	const shipdateInput = document.querySelector('#shipdate');
	const termInput = document.querySelector('#term');
	const cycleSelect = document.querySelector('#cycle');
	const facilitySelect = document.querySelector('#facility');
	const barcodeInput = document.querySelector('#barcode');
	const errorMessage = document.querySelector('#error-message');
	
	var isSubmittingBarcode = false;
	
	function submitBarcodeValue(barcodeValue) {
		if (isSubmittingBarcode) return;
		isSubmittingBarcode = true;
	  
		// Get form values
		const carrier = carrierSelect.value;
		const meal = mealSelect.value;
		const config = configSelect.value;
		const shipdate = shipdateInput.value;
		const term = termInput.value;
		const cycle = cycleSelect.value;
		const facility = facilitySelect.value;
	  
		// Validate input
		if (!carrier || !meal || !config || !shipdate || !term || !cycle || !facility || !barcodeValue) {
		  errorMessage.textContent = 'All fields are required';
		  isSubmittingBarcode = false;
		  return;
		}
	  
		// Convert shipdate to MM/DD/YYYY format and concatenate Carrier,Meal and Config with an underscore
		const dateParts = shipdate.split("-");
		const formattedShipdate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
		const fullCarrier = `${carrier}_${meal}_${config}`;
	  
		// Store the value in Firebase Realtime Database
		dataRef.push({
		  Carrier: fullCarrier,
		  Cycle: cycle,
		  Date: formattedShipdate, // store the formatted shipdate
		  Facility: facility,
		  Term: term,
		  Tracking_Numbers: barcodeValue
		})
		.then(() => {
		  console.log('Barcode added successfully');
		  barcodeInput.value = ''; // Clear the barcode input
		  isSubmittingBarcode = false;
		})
		.catch((error) => {
		  console.error('Error adding barcode:', error);
		  isSubmittingBarcode = false;
		});
	  }
	  	  	  
	
	// Listen for form submission
	barcodeInput.addEventListener("keyup", function(event) {
		console.log("Key code:", event.keyCode);
		// Check if the Enter key was pressed
		if (event.keyCode === 13) {
		// Get the value of the barcode input field
		var barcodeValue = barcodeInput.value.replace(/\s/g, "");
	
		// Determine the length of the barcode
		if (barcodeValue.length === 21 || barcodeValue.length === 20 || barcodeValue.length === 17 || barcodeValue.length === 18) {
			// Use entire barcode
		} else if (barcodeValue.length === 34) {
			// Remove the first 22 digits for FedEx barcodes
			barcodeValue = barcodeValue.substring(22);
		} else {
			// Handle other barcodes
			barcodeInput.value = "";
			return;
		}
	
		dataRef.orderByChild("Tracking_Numbers").equalTo(barcodeValue).once("value", function(scannedSnapshot) {
			if (scannedSnapshot.exists()) {
			barcodeInput.value = "";
			// Barcode has already been scanned, display error message
			console.log("Barcode already exists");
			} else {
			submitBarcodeValue(barcodeValue);
			}
		});
		}
	});
})
