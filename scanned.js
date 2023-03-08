// Reference the database to Scanned
var scannedRef = firebase.database().ref("Scanned");
// Get the submit button and barcode input field
var submitButton = document.getElementById("barcode-submit");
var barcodeInput = document.getElementById("barcode");

// Add a click event listener to the submit button
submitButton.addEventListener("click", function() {
  // Get the value of the barcode input field
  var barcodeValue = barcodeInput.value;
  
  // Get the current timestamp
  var now = new Date();
  var timestamp = now.toLocaleDateString(); // Extracts only the date portion
  
  // Save the barcode value and timestamp to the database
  scannedRef.push({
    "Tracking_Numbers": barcodeValue,
    "Date": timestamp
  });
  
  // Clear the barcode input field
  barcodeInput.value = "";
});


// Get the #scanned element
var scannedElement = document.getElementById("scanned");
// Listen for changes in the Scanned node
scannedRef.on("value", function(snapshot) {
  // Get the scanned data from the snapshot
  var scannedData = snapshot.val();
  // Count the number of items in the scanned data that also appear in the shipment data
  var count = 0;
  snapshot.forEach(function(childSnapshot) {
    var scannedItem = childSnapshot.val();
    for (var i = 0; i < shipmentData.length; i++) {
      var shipmentItem = shipmentData[i];
      if (scannedItem["Tracking_Numbers"] === shipmentItem["Tracking_Numbers"]) {
        count++;
        break;
      }
    }
  });
  // Update the #scanned element with the count
  scannedElement.innerHTML = count;
});
