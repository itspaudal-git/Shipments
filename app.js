 
const firebaseConfig = {
  apiKey: "AIzaSyAEZp1re3bAhXyL752w0P6DAaa-kT1EqH0",
  authDomain: "tovala-bol.firebaseapp.com",
  databaseURL: "https://tovala-bol-default-rtdb.firebaseio.com",
  projectId: "tovala-bol",
  storageBucket: "tovala-bol.appspot.com",
  messagingSenderId: "1022301720035",
  appId: "1:1022301720035:web:945577bb5d84dc48a8a4d6",
  measurementId: "G-MKBD69C3LG"
};
// initialize firebase
firebase.initializeApp(firebaseConfig);


// Set Data for Term
var database = firebase.database();

var barcodeInput = document.getElementById("barcode");
var termSelectElement = document.getElementById('Numbers');
var locationSelectElement = document.getElementById('text');
var dateSelectElement = document.getElementById('date');

// Add event listeners to the dropdown menus
termSelectElement.addEventListener('change', function() {
  var selectedTerm = termSelectElement.value;
  console.log(selectedTerm);
  document.getElementById('selectedTerm').innerHTML = selectedTerm;
});

locationSelectElement.addEventListener('change', function() {
  var selectedLocation = locationSelectElement.value;
  console.log(selectedLocation);
  document.getElementById('selectedLocation').innerHTML = selectedLocation;
});

dateSelectElement.addEventListener('change', function() {
  var selecteddate = dateSelectElement.value;
  console.log(selecteddate);
  document.getElementById('selecteddate').innerHTML = selecteddate;
});

// Defer the selection of the barcode input field
setTimeout(function() {
  barcodeInput.select();
}, 0);


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

function deleteDuplicates() {
  // Define the correct password
  var correctPassword = "tovala";

  // Ask the user for the password
  var inputPassword = prompt("Please enter the password:");

  // Check if the input password is correct
  if (inputPassword === correctPassword) {
    // Get a reference to the Data node in the Firebase database
    var dataRef = firebase.database().ref("Data");

    // Query the data in the Firebase database
    dataRef.once("value", function(snapshot) {
      // Create an empty object to store tracking numbers and their keys
      var trackingNumbers = {};

      // Loop through the data and store tracking numbers and keys in the trackingNumbers object
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var trackingNumber = childSnapshot.val().Tracking_Numbers;

        // If the tracking number is not in the object, add it with the key as a value
        if (!trackingNumbers.hasOwnProperty(trackingNumber)) {
          trackingNumbers[trackingNumber] = [key];
        } else {
          // If the tracking number is already in the object, push the new key into the array of keys
          trackingNumbers[trackingNumber].push(key);
        }
      });

      // Loop through the trackingNumbers object and delete duplicates
      for (var trackingNumber in trackingNumbers) {
        var keys = trackingNumbers[trackingNumber];
        if (keys.length > 1) {
          // If there are more than one keys for the same tracking number, delete all but the first one
          for (var i = 1; i < keys.length; i++) {
            dataRef.child(keys[i]).remove();
          }
        }
      }

      // Show a success message after deleting duplicates
      alert("Duplicate entries have been deleted.");
    });
  } else {
    // Show an error message if the password is incorrect
    alert("Incorrect password. Please try again.");
  }
}
window.deleteDuplicates = deleteDuplicates;


