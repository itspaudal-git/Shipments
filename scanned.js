if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Reference the database to Data and Scanned
var dataRef = firebase.database().ref("Data");
var scannedRef = firebase.database().ref("Scanned");

// Get the submit button and barcode input field
var submitButton = document.getElementById("barcode-submit");
var barcodeInput = document.getElementById("barcode");
var errorMessage = document.getElementById("error-message");
var successMessage = document.getElementById("success-message");

var isSubmittingBarcode = false;


barcodeInput.addEventListener("keyup", function(event) {
  

  // Check if the Enter key was pressed
  if (event.keyCode === 13) {
    // Get the value of the barcode input field
    var barcodeValue = barcodeInput.value.replace(/\s/g, "");

    // Assuming the FedEx barcode has a fixed length of 34 characters
    if (barcodeValue.length === 34) {
      // Remove the first 22 digits for FedEx barcodes
      barcodeValue = barcodeValue.substring(22);
    } else {
      // Handle other barcodes, if necessary
    }

    // Barcode was scanned, submit it automatically
    submitBarcodeValue(barcodeValue);
  }

  // Reset the idle timer when the user interacts with the page
  resetIdleTimer();
});


// Set an idle timeout to automatically select the barcode input field
var idleTimeout = null;
function resetIdleTimer() {
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(function() {
    barcodeInput.select();
  }, 1000);
}

// Wait for the page to finish loading, then select the barcode input field
window.onload = function() {
  barcodeInput.select();
  resetIdleTimer();
};



function submitBarcodeValue(barcodeValue) {
  if (isSubmittingBarcode) {
    return; // Barcode is already being submitted
  }

  // Set the flag to indicate that the barcode is being submitted
  isSubmittingBarcode = true;

  // Check if the barcode value exists in the shipment data
  dataRef.orderByChild("Tracking_Numbers").equalTo(barcodeValue).once("value", function(snapshot) {
    if (snapshot.exists()) {
      // Barcode exists in the shipment data, check if it has already been scanned
      barcodeInput.value = "";
      scannedRef.orderByChild("Tracking_Numbers").equalTo(barcodeValue).once("value", function(scannedSnapshot) {
        if (scannedSnapshot.exists()) {
          // Barcode has already been scanned, display error message
          errorMessage.innerHTML = "Duplicate Scan";
          errorMessage.style.display = "block";

          // Hide the error message after 3 seconds
          setTimeout(function() {
            errorMessage.style.display = "none";
          }, 3000);
        } else {
          // Barcode has not been scanned yet, save it to the database
          // Get the current timestamp
          var now = new Date();
          var timestamp = now.toLocaleDateString(); // Extracts only the date portion

          // Save the scanned barcode value to Firebase
          var newScanRef = scannedRef.push();
          newScanRef.set({
            "Tracking_Numbers": barcodeValue,
            // "Date": timestamp
          }, function(error) {
            if (error) {
              // Error occurred while saving to Firebase
              console.error("Error saving scanned value to Firebase:", error);
            } else {
              // Success message
              successMessage.innerHTML = "Scanned Successful";
              successMessage.style.display = "block";

              // Hide the success message after 3 seconds
              setTimeout(function() {
                successMessage.style.display = "none";
              }, 1000);
            }
          });
        }
        // Reset the isSubmittingBarcode flag
        isSubmittingBarcode = false;
      });
    } else {
      // Barcode does not exist in the shipment data, display error message
      errorMessage.innerHTML = "Barcode not found";
      errorMessage.style.display = "block";

      // Hide the error message after 3 seconds
      setTimeout(function() {
        errorMessage.style.display = "none";
      }, 3000);

      // Clear the barcode input field after 3 seconds
      setTimeout(function() {
        barcodeInput.value = "";
      }, 300);

      // Reset the isSubmittingBarcode flag
      isSubmittingBarcode = false;
    }
  });
}


// Get the #scanned element
var scannedElement = document.getElementById("scanned");

// Listen for changes in the Scanned node
scannedRef.on("value", function(snapshot) {
  // Get the scanned data from the snapshot
  var scannedData = snapshot.val();

  // Retrieve the filtered data from all_shipments.js
  var filteredData = shipmentData.filter(function(item) {
    return (item.Facility === locationSelectElement.value || locationSelectElement.value === '') &&
           (item.Term === termSelectElement.value || termSelectElement.value === '') &&
           (item.Date === dateSelectElement.value || dateSelectElement.value === '');
  });

  // Count the number of items in the scanned data that also appear in the filtered data
  var count = 0;
  snapshot.forEach(function(childSnapshot) {
    var scannedItem = childSnapshot.val();
    for (var i = 0; i < filteredData.length; i++) {
      var shipmentItem = filteredData[i];
      if (scannedItem["Tracking_Numbers"] === shipmentItem["Tracking_Numbers"]) {
        count++;
        break;
      }
    }
  });

  // Update the #scanned element with the count
  scannedElement.innerHTML = count;
});
function uploadFile() {
  // Get the selected file
  var file = document.getElementById("file").files[0];

  // Create a new FileReader object
  var reader = new FileReader();

  // Define the mapping object
  var mapping = {
    "Tracking Numbers": "Tracking_Numbers",
    "Carrier": "Carrier",
    "Date": "Date",
    "Facility": "Facility",
    "Cycle": "Cycle",
    "Term": "Term"
  };

  // Set the onload function for the FileReader object
  reader.onload = function(event) {
    // Get the data from the uploaded file
    var data = event.target.result;

    // Split the data into rows
    var rows = data.split("\n");

    // Extract the headers from the first row
    var headers = rows[0].split(",");

    // Modify the headers to match the desired format
    for (var i = 0; i < headers.length; i++) {
      var originalHeader = headers[i].trim();
      var newHeader = mapping[originalHeader];
      if (newHeader !== undefined) {
        headers[i] = newHeader;
      }
    }

    // Loop through the remaining rows and upload each row to the database
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i].split(",");
            
      // Create an object with properties matching the header names
      var item = {};
      for (var j = 0; j < headers.length; j++) {
        item[headers[j].trim()] = row[j].trim();
      }
      
      // Upload the item to the database
      firebase.database().ref("Data").push(item);
    }

    alert("File uploaded successfully!");
    document.getElementById("file").value = "";
  };

  // Read the selected file as text
  reader.readAsText(file);
}
