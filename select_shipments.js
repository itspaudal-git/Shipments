if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var shipmentData;
var scannedData = {}; // Define scannedData in the global scope
var scannedRef = firebase.database().ref('Scanned');

function unScanneddata(selectedTerm, selectedLocation, selectedDate) {
  // Filter the shipment data for the selected carrier, term, location, and date
  var filteredData = shipmentData.filter(function(item) {
    return item.Term === selectedTerm &&
           item.Facility === selectedLocation &&
           item.Date === selectedDate;
  });
  
  // Get the scanned tracking numbers
  var scannedTrackingNumbers = new Set(Object.values(scannedData).map(function(item) {
    return item.Tracking_Numbers;
  }));

  // Filter out the scanned tracking numbers from the filtered data
  filteredData = filteredData.filter(function(item) {
    return !scannedTrackingNumbers.has(item.Tracking_Numbers);
  });

  console.log(filteredData);
  // Generate the table
  var tableHTML = '<table><thead><tr><th>Carrier</th><th>Tracking Numbers</th><th>Date</th><th>Facility</th><th>Cycle</th><th>Term</th></tr></thead><tbody>';
  filteredData.forEach(function(item) {
    tableHTML += '<tr>' +
                 '<td>' + item.Carrier + '</td>' +
                 '<td>' + item.Tracking_Numbers + '</td>' +
                 '<td>' + item.Date + '</td>' +
                 '<td>' + item.Facility + '</td>' +
                 '<td>' + item.Cycle + '</td>' +
                 '<td>' + item.Term + '</td>' +
                 '</tr>';
  });
  tableHTML += '</tbody></table>';
  // Open the table in a new window
  var win = window.open("", "_blank");
  win.document.write('<html><head><title>Unscanned Shipments for ' + '</title></head><body>' + tableHTML + '</body></html>');
}


// Listen for changes in the Firebase data
firebase.database().ref('Data').on('value', function(snapshot) {
  var data = []; // initialize an empty array to hold the data
  snapshot.forEach(function(childSnapshot) {
    var eachnode = childSnapshot.val();
    data.push(eachnode); // add each node to the array
  });

  shipmentData = data; // assign the data to the global variable

  // Use the global variable in the event listener
  const shipmentDataDiv = document.getElementById("shipment-data");
  // Call populateTable to initially populate the table
  populateTable();
});

// Listen for changes in the Firebase data
firebase.database().ref('Scanned').on('value', function(snapshot) {
  scannedData = snapshot.val();
});
