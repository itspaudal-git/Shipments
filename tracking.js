if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
// Event listener for Tracking Numbers
const fileInput2 = document.getElementById("trackingCsvFile");
const chooseFileBtn2 = document.querySelector(".choose-file-btn-tracking");

chooseFileBtn.addEventListener("click", function() {
    fileInput.click();
});

document.getElementById("uploadtrackingBtn").addEventListener("click", function() {
    const csvFile = document.getElementById("trackingCsvFile").files[0];
    const term = document.getElementById("mealTerm3").value;
    const facility = document.getElementById("selectFacility3").value;


  
    if (!csvFile) {
      alert("Please upload a Meal Configuration CSV file.");
      return;
    }
  
    if (!term) {
      alert("Please enter a term for Meal Configuration.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(event) {
      const csvData = event.target.result;
      const data = parseCSV(csvData);
      for (let i = 0; i < data.length; i++) {
        data[i]["fc"] = facility;

      }
      uploadDataToFirebase(data, term, "Tracking");
    };
  
    reader.readAsText(csvFile);
  });
  
  document.querySelector('.choose-file-btn-tracking').addEventListener('click', function() {
    document.querySelector('#trackingCsvFile').click();
});