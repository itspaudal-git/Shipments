if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Reference the database to Delete
var tracking_delete = firebase.database().ref("Delete");


barcodeInput.addEventListener("keyup", function(event) {
  console.log("Key code:", event.keyCode);
  // Check if the Enter key was pressed
  if (event.keyCode === 13) {
    // Get the value of the barcode input field
    var barcodeValue = barcodeInput.value.replace(/\s/g, "");

    // Determine the length of the barcode
    if (barcodeValue.length === 17 ||barcodeValue.length === 12 || barcodeValue.length === 19 || barcodeValue.length === 18) {
      // Use entire barcode
    } else if (barcodeValue.length === 34) {
      // Remove the first 22 digits for FedEx barcodes
      barcodeValue = barcodeValue.substring(22);
    } else {
      // Handle other barcodes
      barcodeInput.value = "";
      return;
    }

    // Barcode was scanned, submit it automatically
    submitBarcodeValue(barcodeValue);
  }
});

function submitBarcodeValue(barcodeValue) {
  // Get the current timestamp in UTC
  var timestamp = new Date().toUTCString();

  // Define the data to push to Firebase
  var data = {
    "Tracking_Numbers": barcodeValue,
    "Date": timestamp
  };

  // Push the data to Firebase
  tracking_delete.push(data);

  // Clear the barcode input field
  barcodeInput.value = "";
}


// Define the deleteDuplicates() function
function deleteFiles() {
  // Initialize the total deleted count
  var deletedCount = 0;

  // Get references to the "Data" and "Delete" nodes
  var dataRef = firebase.database().ref("Data");
  var deleteRef = firebase.database().ref("Delete");

  // Listen for changes to the "Data" node
  dataRef.on("child_added", function(dataSnapshot) {
    // Get the tracking number from the "Data" node
    var dataTrackingNumber = dataSnapshot.child("Tracking_Numbers").val();

    // Check if the tracking number exists in the "Delete" node
    deleteRef.orderByChild("Tracking_Numbers").equalTo(dataTrackingNumber).once("value", function(deleteSnapshot) {
      if (deleteSnapshot.exists()) {
        // Delete the child nodes from both the "Data" and "Delete" nodes
        dataSnapshot.ref.remove();
        deleteSnapshot.forEach(function(deleteChildSnapshot) {
          deleteChildSnapshot.ref.remove();
          deletedCount++;
        });

      }
    });
  });

  // Listen for changes to the "Delete" node
  deleteRef.on("child_added", function(deleteSnapshot) {
    // Get the tracking number from the "Delete" node
    var deleteTrackingNumber = deleteSnapshot.child("Tracking_Numbers").val();

    // Check if the tracking number exists in the "Data" node
    dataRef.orderByChild("Tracking_Numbers").equalTo(deleteTrackingNumber).once("value", function(dataSnapshot) {
      if (dataSnapshot.exists()) {
        // Delete the child nodes from both the "Data" and "Delete" nodes
        deleteSnapshot.ref.remove();
        dataSnapshot.forEach(function(dataChildSnapshot) {
          dataChildSnapshot.ref.remove();
          deletedCount++;
        });
      }
    });
  });
}


deleteFiles();

