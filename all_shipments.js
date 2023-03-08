var shipmentData; // define the variable in the global scope

// Retrieve the data from Firebase
firebase.database().ref('Data').on('value', function(snapshot) {
  var data = []; // initialize an empty array to hold the data
  snapshot.forEach(function(childSnapshot) {
    var eachnode = childSnapshot.val();
    data.push(eachnode); // add each node to the array
  });

  shipmentData = data; // assign the data to the global variable

  // Use the global variable in the event listener
  const shipmentDataDiv = document.getElementById("shipment-data");

  const shipmentDataSelect = document.getElementById("shipment-data-select");
  shipmentDataSelect.addEventListener("change", function() {
    if (shipmentDataSelect.value === "all-shipments") {
      var tableHTML = '';
      shipmentData.forEach(function(item) {
        tableHTML += '<tr>' +
                     '<td>' + item.Carrier + '</td>' +
                     '<td>' + item['Tracking_Numbers'] +
                     '<td>' + item.Date + '</td>' +
                     '<td>' + item.Facility + '</td>' +
                     '<td>' + item.Cycle + '</td>' +
                     '<td>' + item.Term + '</td>' +
                     '</tr>';
      });
      shipmentDataDiv.innerHTML = '<table><thead><tr><th>Carrier</th><th>Tracking_Numbers</th><th>Date</th><th>Facility</th><th>Cycle</th><th>Term</th></tr></thead><tbody>' + tableHTML + '</tbody></table>';
    } else {
      shipmentDataDiv.innerHTML = "";
    }
  });

  // Add event listeners to the select elements
  locationSelectElement.addEventListener('change', populateTable);
  termSelectElement.addEventListener('change', populateTable);
  dateSelectElement.addEventListener('change', populateTable);

  // Function to populate the table based on the selected criteria
  function populateTable() {
    var selectedLocation = locationSelectElement.value;
    var selectedTerm = termSelectElement.value;
    var selectedDate = dateSelectElement.value;

    // Filter the data based on the selected criteria
    var filteredData = data.filter(function(item) {
      return (item.Facility === selectedLocation || selectedLocation === '') &&
             (item.Term === selectedTerm || selectedTerm === '') &&
             (item.Date === selectedDate || selectedDate === '');
    });

    // Generate the table based on the filtered data
    var tableHTML = '';
    filteredData.forEach(function(item) {
      tableHTML += '<tr>' +
                   '<td>' + item.Carrier + '</td>' +
                   '<td>' + item['Tracking_Numbers'] +
                   '<td>' + item.Date + '</td>' +
                   '<td>' + item.Facility + '</td>' +
                   '<td>' + item.Cycle + '</td>' +
                   '<td>' + item.Term + '</td>' +
                   '</tr>';
    });

    // Display the table in the shipment-data element
    shipmentDataDiv.innerHTML = '<table><thead><tr><th>Carrier</th><th>Tracking_Numbers</th><th>Date</th><th>Facility</th><th>Cycle</th><th>Term</th></tr></thead><tbody>' + tableHTML + '</tbody></table>';
  }
});
