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
    // Reference the database to Scanned
    var scannedRef = firebase.database().ref("Data");
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

// Set Data for Term
var database = firebase.database();

var termSelectElement = document.getElementById('Numbers');
termSelectElement.addEventListener('change', function() {
  var selectedTerm = termSelectElement.value;
  console.log(selectedTerm); // should output the selected value, such as "322"
  document.getElementById('selectedTerm').innerHTML = selectedTerm;
});

var locationSelectElement = document.getElementById('text');
locationSelectElement.addEventListener('change', function() {
  var selectedLocation = locationSelectElement.value;
  console.log(selectedLocation); // should output the selected value, such as "Saltlake"
  document.getElementById('selectedLocation').innerHTML = selectedLocation;
});

var dateSelectElement = document.getElementById('date');
dateSelectElement.addEventListener('change', function() {
  var selecteddate = dateSelectElement.value;
  console.log(selecteddate); // should output the selected value, such as "3/4/2023"
  document.getElementById('selecteddate').innerHTML = selecteddate;
});

// Retrieve the list of facilities from Firebase, ordered by 'Facility' value
firebase.database().ref('Data').on('value', function(snapshot) {
  var locationSelectElement = document.getElementById('text');
  locationSelectElement.innerHTML = ''; // clear existing options
  var uniqueFacilities = new Set(); // create a set to hold unique facilities
  snapshot.forEach(function(childSnapshot) {
    var eachnode = childSnapshot.val();
    var facility = eachnode.Facility;
    if (facility && !uniqueFacilities.has(facility.trim())) { // check if facility is not blank and not already in the set
      uniqueFacilities.add(facility.trim()); // add facility to set if it's unique
      var optionElement = document.createElement('option');
      optionElement.value = facility.trim();
      optionElement.text = facility.trim();
      locationSelectElement.appendChild(optionElement);
    }
  });
});


// Retrieve the list of terms from Firebase, ordered by 'Term' value
firebase.database().ref('Data').on('value', function(snapshot) {
  var selectElement = document.getElementById('Numbers');
  selectElement.innerHTML = ''; // clear existing options
  var uniqueTerms = new Set(); // create a set to hold unique terms
  snapshot.forEach(function(childSnapshot) {
    var eachnode = childSnapshot.val();
    var term = eachnode.Term;
    if (term && term.trim() !== '' && !uniqueTerms.has(term)) { // check if term is defined, not blank, and unique
      uniqueTerms.add(term); // add term to set if it's unique
    }
  });
  // convert set to array, sort in reverse order, and append sorted options to select element
  var termArray = Array.from(uniqueTerms).sort().reverse();
  termArray.forEach(function(term) {
    var optionElement = document.createElement('option');
    optionElement.value = term;
    optionElement.text = term;
    selectElement.appendChild(optionElement);

  });
});

// Retrieve the list of dates from Firebase, ordered by 'Date' value
firebase.database().ref('Data').on('value', function(snapshot) {
  var dateSelectElement = document.getElementById('date');
  dateSelectElement.innerHTML = ''; // clear existing options
  var uniqueDates = new Set(); // create a set to hold unique dates
  snapshot.forEach(function(childSnapshot) {
    var eachnode = childSnapshot.val();
    var date = eachnode.Date;
    if (date && !uniqueDates.has(date)) { // check if date is defined and not already in the set
      uniqueDates.add(date); // add date to set if it's unique
    }
  });
  // convert set to array, sort in reverse order, and append sorted options to select element
  var dateArray = Array.from(uniqueDates).sort().reverse();
  dateArray.forEach(function(date) {
    var optionElement = document.createElement('option');
    optionElement.value = date;
    optionElement.text = date;
    dateSelectElement.appendChild(optionElement);
    
  });
});






