import('./module.js')
.then(module => {
  // Use the imported module here
})
.catch(error => {
  // Handle the error here
});  
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
// initialize firebase
firebase.initializeApp(firebaseConfig);
    // Reference the database
    var scannedRef = firebase.database().ref("Scanned");
    // Get the submit button and barcode input field
    var submitButton = document.getElementById("barcode-submit");
    var barcodeInput = document.getElementById("barcode");
    // Add a click event listener to the submit button
    submitButton.addEventListener("click", function() {
      // Get the value of the barcode input field
      var barcodeValue = barcodeInput.value;
      // Save the barcode value to the database
      scannedRef.push({
        "Tracking Numbers": barcodeValue
      });
      // Clear the barcode input field
      barcodeInput.value = "";
    });
  