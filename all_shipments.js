if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var shipmentData;
var scannedData = {}; // Define scannedData in the global scope
var scannedRef = firebase.database().ref('Scanned');

// Function to populate the table based on the selected criteria
function populateTable() {
  // Get the selected filters
  var selectedLocation = locationSelectElement.value;
  var selectedTerm = termSelectElement.value;
  var selectedDate = dateSelectElement.value;

  // Filter the data based on the selected criteria
  var filteredData = shipmentData.filter(function(item) {
    return (item.Facility === selectedLocation || selectedLocation === '') &&
           (item.Term === selectedTerm || selectedTerm === '') &&
           (item.Date === selectedDate || selectedDate === '');
  });

  // Get the scanned count for each carrier
  var carriers = {};
  filteredData.forEach(function(item) {
    if (item.Carrier in carriers) {
      carriers[item.Carrier].push(item.Tracking_Numbers);
    } else {
      carriers[item.Carrier] = [item.Tracking_Numbers];
    }
  });

  // Get the scanned count for each carrier
  var scannedCounts = {};
  var scannedData = {};
  Object.keys(carriers).forEach(function(carrier) {
    var count = carriers[carrier].length;
    var scannedCount = 0;
    carriers[carrier].forEach(function(trackingNumber) {
      if (trackingNumber in scannedData) {
        scannedCount++;
      }
    });
    var unscannedCount = count - scannedCount;
    scannedCounts[carrier] = [count, scannedCount, unscannedCount];
  });

  // Generate the table based on the unique carriers and their counts
  var tableHTML = '';
  Object.keys(scannedCounts).forEach(function(carrier) {
    var counts = scannedCounts[carrier];
    tableHTML += '<tr>' +
    '<td>' + carrier + '</td>' +
    '<td>' + counts[0] + '</td>' +
    '<td>' + counts[1] + '</td>' +
    '<td>' + counts[2] + '</td>' +
    '<td><a id="view-button" href="#" onclick="unScanneddata(\'' + selectedTerm + '\',\'' + selectedLocation + '\',\'' + selectedDate + '\',\'' + carrier + '\')">View</a></td>' +
    '</tr>';
  });

  // Display the table in the shipment-data element
  const shipmentDataDiv = document.getElementById("shipment-data");
  shipmentDataDiv.innerHTML = '<table><thead><tr><th>Carrier</th><th>Total</th><th>Scanned</th><th>Remaining</th><th>Unscanned</th></tr></thead><tbody>' + tableHTML + '</tbody></table>';

  // Display the count in the total span element
  var totalCount = filteredData.length;
  document.getElementById("total").innerHTML = totalCount;

  // Update the scanned count
  updateScannedCount(filteredData, carriers);
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
  // Add event listeners to the select elements
  locationSelectElement.addEventListener('change', populateTable);
  termSelectElement.addEventListener('change', populateTable);
  dateSelectElement.addEventListener('change', populateTable);

  // Call populateTable to initially populate the table
  populateTable();
});

function updateScannedCount(filteredData) {
  // Get the #scanned element
  var scannedElement = document.getElementById("scanned");
  // Listen for changes in the Scanned node
  scannedRef.on("value", function(snapshot) {
    // Get the scanned data from the snapshot
    var scannedData = snapshot.val();
    // Count the number of items in the scanned data that also appear in the shipment data
    var scannedCounts = {};
    Object.keys(scannedData).forEach(function(key) {
      var scannedItem = scannedData[key];
      var trackingNumber = scannedItem.Tracking_Numbers;
      filteredData.forEach(function(shipmentItem) {
        if (shipmentItem.Tracking_Numbers === trackingNumber) {
          if (shipmentItem.Carrier in scannedCounts) {
            scannedCounts[shipmentItem.Carrier]++;
          } else {
            scannedCounts[shipmentItem.Carrier] = 1;
          }
        }
      });
    });
    // Update the scanned count for each carrier in the table
    var tableRows = document.querySelectorAll("#shipment-data tbody tr");
    var totalScanned = 0;
    tableRows.forEach(function(row) {
      var carrier = row.cells[0].textContent;
      var count = parseInt(row.cells[1].textContent);
      var scannedCount = scannedCounts[carrier] || 0;
      var unscannedCount = count - scannedCount;
      row.cells[2].textContent = scannedCount;
      row.cells[3].textContent = unscannedCount;
      totalScanned += scannedCount;
    });
    // Update the #scanned element with the count
    scannedElement.innerHTML = totalScanned;

    // Calculate and display the percentage
    var totalCount = filteredData.length;
    var percentage = (totalScanned / totalCount) * 100;
    var roundedPercentage = percentage.toFixed(0);
    document.getElementById("percent").innerHTML = roundedPercentage + "% Completed";
  });
}