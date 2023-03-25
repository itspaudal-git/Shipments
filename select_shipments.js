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
var tableHTML = '<table class="styled-table">' +
  '<thead>' +
    '<tr>' +
      '<th data-sort="Carrier">Carrier</th>' +
      '<th data-sort="Tracking_Numbers">Tracking Numbers</th>' +
      '<th data-sort="Date">Date</th>' +
      '<th data-sort="Facility">Facility</th>' +
      '<th data-sort="Cycle">Cycle</th>' +
      '<th data-sort="Term">Term</th>' +
      '<th data-sort="Name">Name</th>' +
      '<th data-sort="Phone">Phone</th>' +
    '</tr>' +
  '</thead>' +
  '<tbody>';
  function sortData(field, data) {
    return data.sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
  }
  
  function renderTable(data) {
    var tableHTML = '<table class="styled-table">' +
      '<thead>' +
        '<tr>' +
          '<th data-sort="Carrier">Carrier</th>' +
          '<th data-sort="Tracking_Numbers">Tracking Numbers</th>' +
          '<th data-sort="Date">Date</th>' +
          '<th data-sort="Facility">Facility</th>' +
          '<th data-sort="Cycle">Cycle</th>' +
          '<th data-sort="Term">Term</th>' +
          '<th data-sort="Name">Name</th>' +
          '<th data-sort="Phone">Phone</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>';
  
    data.forEach(function(item) {
      tableHTML += '<tr>' +
                   '<td>' + item.Carrier + '</td>' +
                   '<td>' + item.Tracking_Numbers + '</td>' +
                   '<td>' + item.Date + '</td>' +
                   '<td>' + item.Facility + '</td>' +
                   '<td>' + item.Cycle + '</td>' +
                   '<td>' + item.Term + '</td>' +
                   '<td>' + item.Name + '</td>' +
                   '<td>' + item.Phone + '</td>' +
                   '</tr>';
    });
  
    tableHTML += '</tbody></table>';
    return tableHTML;
  }
  
var tableStyles = `
  .styled-table {
    width: 70%;
    border-collapse: collapse;
  }
  .styled-table th, .styled-table td {
    border: 1px solid #999;
    padding: 0.5rem;
    text-align: left;
  }
  .styled-table thead {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  .styled-table tbody tr:nth-child(even) {
    background-color: #f8f8f8;
  }
`;

// Open the table in a new window
var win = window.open("", "_blank");
win.document.write('<html><head><title>Unscanned Shipments for ' + '</title><style>' + tableStyles + '</style></head><body></body></html>');
win.document.close();

// Add the table to the new window
win.document.body.innerHTML = renderTable(filteredData);

// Attach click event listeners to the headers
var headers = win.document.querySelectorAll('.styled-table th');
headers.forEach(function(header) {
  header.addEventListener('click', function() {
    var sortField = header.getAttribute('data-sort');
    var sortedData = sortData(sortField, filteredData);
    win.document.body.innerHTML = renderTable(sortedData);

    // Reattach click event listeners to the headers in the new table
    var updatedHeaders = win.document.querySelectorAll('.styled-table th');
    updatedHeaders.forEach(function(updatedHeader) {
      updatedHeader.addEventListener('click', function() {
        var updatedSortField = updatedHeader.getAttribute('data-sort');
        var updatedSortedData = sortData(updatedSortField, filteredData);
        win.document.body.innerHTML = renderTable(updatedSortedData);
      });
    });
  });
});


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
