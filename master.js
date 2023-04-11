if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function parseCSV(csvData) {
    const lines = csvData.trim().split("\n");
    const header = lines[0].split(",");
    const data = [];

    // Sanitize header keys
    for (let i = 0; i < header.length; i++) {
        header[i] = header[i].replace(/[\.\#\$\[\]\/\(\)\n]/g, "_").trim();
    }

    for (let i = 1; i < lines.length; i++) {
        const lineData = [];
        let valueBuffer = '';
        let insideQuotes = false;

        for (let j = 0; j < lines[i].length; j++) {
            const currentChar = lines[i][j];
            if (currentChar === '"') {
                insideQuotes = !insideQuotes;
            } else if (currentChar === ',' && !insideQuotes) {
                lineData.push(valueBuffer.trim());
                valueBuffer = '';
            } else {
                valueBuffer += currentChar;
            }
        }
        lineData.push(valueBuffer.trim());

        const row = {};

        for (let j = 0; j < header.length; j++) {
            const sanitizedKey = header[j].replace(/[\.\#\$\[\]\/\(\)\n]/g, "_").trim();
            if (sanitizedKey !== "") {
                row[sanitizedKey] = lineData[j].trim();
            }
        }

        data.push(row);
    }

    return data;
}


// Event listener for Master Tracking upload
document.getElementById("uploadMasterBtn").addEventListener("click", function () {
    const csvFile = document.getElementById("masterCsvFile").files[0];
    const term = document.getElementById("masterTerm").value;
    const facility = document.getElementById("selectFacility").value;
    const cycle = document.getElementById("selectCycle").value;

    if (!csvFile) {
        alert("Please upload a Master Tracking CSV file.");
        return;
    }

    if (!term) {
        alert("Please enter a term for Master Tracking.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const csvData = event.target.result;
        const data = parseCSV(csvData);
        uploadDataToFirebase(data, term, facility, cycle, "Master");
    };

    reader.readAsText(csvFile);
});

// Add the missing querySelector and event listener for the "Choose File" button in the Master Tracking section:

const masterFileInput = document.getElementById("masterCsvFile");
const chooseMasterFileBtn = document.querySelector(".choose-file2-btn");

chooseMasterFileBtn.addEventListener("click", function () {
    masterFileInput.click();
});
// Add event listener for "Choose File" button of Master Tracking
document.getElementById("masterCsvFile").addEventListener("change", function () {
    const fileName = this.files[0]?.name || "";
    document.querySelector(".choose-file2-btn").textContent = fileName || "Choose File";
});

// Event listener for Meal Configuration upload
const fileInput = document.getElementById("mealCsvFile");
const chooseFileBtn = document.querySelector(".choose-file-btn");

chooseFileBtn.addEventListener("click", function() {
    fileInput.click();
});

document.getElementById("uploadMealBtn").addEventListener("click", function() {
    const csvFile = document.getElementById("mealCsvFile").files[0];
    const term = document.getElementById("mealTerm").value;
    const facility = document.getElementById("selectFacility2").value;


  
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
      uploadDataToFirebase(data, term, "Meal Configuration");
    };
  
    reader.readAsText(csvFile);
  });
  

function uploadDataToFirebase(data, term, facility, cycle, node) {
    const dataRef = firebase.database().ref(node);

    data.forEach(function (row) {
        // Skip row if Config is empty for Meal Configuration
        if (node === "Meal Configuration" && (!row.Config || row.Config.trim() === "")) {
            return;
        }

        row["Term"] = term;
        row["fc"] = facility;

        if (node === "Master") {
            row["Cycle"] = cycle;
        }

        const newRowKey = dataRef.push().key;
        dataRef.child(newRowKey).set(row, function (error) {
            if (error) {
                console.log("Data could not be saved: " + error);
            } else {
                console.log("Data saved successfully.");
            }
        });
    });

    alert("Data uploaded to Firebase.");
}
document.getElementById("trackingCsvFile").addEventListener("change", function() {
    const fileName = this.files[0]?.name || "";
    document.querySelector(".choose-file-btn-tracking").textContent = fileName || "Choose File";
});

