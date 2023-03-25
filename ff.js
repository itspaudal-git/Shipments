function uploadFile() {
  // Get the selected file
  var file = document.getElementById("file").files[0];

  // Create a new FileReader object
  var reader = new FileReader();

  // Define the mapping object
  var mapping = {
    "Tracking Numbers": "Tracking_Numbers",
    "Carrier": "Carrier",
    "Date": "Date",
    "Facility": "Facility",
    "Cycle": "Cycle",
    "Term": "Term"
  };

  // Set the onload function for the FileReader object
  reader.onload = function(event) {
    // Get the data from the uploaded file
    var data = event.target.result;

    // Split the data into rows
    var rows = data.split("\n");

    // Extract the headers from the first row
    var headers = rows[0].split(",");

    // Modify the headers to match the desired format
    for (var i = 0; i < headers.length; i++) {
      var originalHeader = headers[i].trim();
      var newHeader = mapping[originalHeader];
      if (newHeader !== undefined) {
        headers[i] = newHeader;
      }
    
      
      // Check if the row has the correct number of elements
      if (row.length === headers.length) {
        // Create an object with properties matching the header names
        var item = {};
        for (var j = 0; j < headers.length; j++) {
          var cellValue = row[j].trim();

          // Check if the cell value is in scientific notation
          if (/^\d+\.\d+E\+\d+$/i.test(cellValue)) {
            var bigIntValue = BigInt(parseFloat(cellValue).toFixed(0));
            item[headers[j].trim()] = bigIntValue.toString();
          } else {
            item[headers[j].trim()] = cellValue;
          }
        }
        
        // Upload the item to the database
        firebase.database().ref("Data").push(item);
      }
    }

    // Show the progress container and dim overlay
    var uploadProgressContainer = document.getElementById("upload-progress-container");
    var uploadProgress = document.getElementById("upload-progress");
    var uploadProgressPercent = document.getElementById("upload-progress-percent");
    uploadProgressContainer.style.display = "block";
    document.querySelector(".dim-overlay").style.display = "block";

    // Simulate upload progress
    var progress = 0;
    var progressInterval = setInterval(function() {
      progress += 10;
      if (progress > 100) {
        clearInterval(progressInterval);
        uploadProgressContainer.style.display = "none";
        document.querySelector(".dim-overlay").style.display = "none";
        document.getElementById("file").value = "";
      } else {
        uploadProgress.value = progress;
        uploadProgressPercent.textContent = progress + "%";
      }
    }, 500);
  };

  // Read the selected file as text
  reader.readAsText(file);
}
