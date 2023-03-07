// Retrieve the data from Firebase
firebase.database().ref('Data').on('value', function(snapshot) {
    var data = []; // initialize an empty array to hold the data
    snapshot.forEach(function(childSnapshot) {
      var eachnode = childSnapshot.val();
      data.push(eachnode); // add each node to the array
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
                     '<td>' + item['Tracking Numbers'] +
                     '<td>' + item.Date + '</td>' +
                     '<td>' + item.Facility + '</td>' +
                     '<td>' + item.Cycle + '</td>' +
                     '<td>' + item.Term + '</td>' +
                     '</tr>';
      });
      
      // Display the table in the shipment-data element
      document.getElementById('shipment-data').innerHTML = '<table><thead><tr><th>Carrier</th><th>Tracking Numbers</th><th>Date</th><th>Facility</th><th>Cycle</th><th>Term</th></tr></thead><tbody>' + tableHTML + '</tbody></table>';
    }
  });
  