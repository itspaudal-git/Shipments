if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
document.getElementById("selectTerm").addEventListener("input", function () {
    updateDashboard();
});

document.getElementById("selectCycle").addEventListener("change", function () {
    updateDashboard();
});

document.getElementById("selectConfig").addEventListener("change", function () {
    updateDashboard();
});
document.getElementById("facility").addEventListener("change", function () {
    updateDashboard();
});


function updateDashboard() {
    const facility = document.getElementById("facility").value;
    const term = document.getElementById("selectTerm").value;
    const cycle = document.getElementById("selectCycle").value;
    const config = document.getElementById("selectConfig").value;

    if (!term) {
        return;
    }

    displayDashboardData(facility, term, cycle, config);
}

function displayDashboardData(facility, term, cycle, config) {
    // Retrieve data from Firebase
    const dataRef = firebase.database().ref("Meal Configuration");
    const masterRef = firebase.database().ref("Master");

    dataRef.orderByChild("Term").equalTo(term).once("value", function (snapshot) {
      const data = snapshot.val();
  
      if (!data) {
        return;
      }
  
      masterRef.once("value", function (masterSnapshot) {
        const masterData = Object.values(masterSnapshot.val() || {});
  
        // Filter and aggregate data
        const mealCounts = masterData.reduce((acc, row) => {
          if (row["Meal_Selection"]) {
            const mealNumbers = row["Meal_Selection"].split(",").map((num) => parseInt(num, 10) * 100);
  
            mealNumbers.forEach((mealNumber) => {
              acc[mealNumber] = (acc[mealNumber] || 0) + 1;
            });
          }
          return acc;
        }, {});
  
        const filteredData = Object.values(data).reduce((acc, row) => {
          const key = `${row["Meal No"]}_${row.Config}_${row["Meal + Title"]}`;
  
          // Check if the configuration matches or is set to "All"
          const configMatches = config === "" || row.Config === config;
          const facilityMatches = facility === "" || row.fc.toLowerCase() === facility.toLowerCase();
  
          // Check if the cycle matches or is set to "All"
          const cycleMatches = cycle === "" || row.Cycle === cycle;
  
          if (configMatches && cycleMatches && facilityMatches) {
            acc[key] = acc[key] || {
              "Meal No": row["Meal No"],
              Configuration: row.Config,
              "Meal + Component": row["Meal + Title"],
              "Meal Count": 0,
            };
  
            acc[key]["Meal Count"] += parseInt(row["Qty"], 10);
            acc[key]["Total Count"] = mealCounts[parseInt(row["Meal No"])];
          }
  
          return acc;
        }, {});
  
        // Render table
        const tableBody = document.getElementById("dashboardTableBody");
        tableBody.innerHTML = "";
  
        for (const row of Object.values(filteredData)) {
            if (row["Meal Count"] !== 0) {
                const tr = document.createElement("tr");
                for (const key in row) {
                    const td = document.createElement("td");
                    td.textContent = row[key];
                    tr.appendChild(td);
                }
                // Add the total count as a new column
                const totalCountTd = document.createElement("td");
                totalCountTd.textContent = row["Total Count"];
                tr.appendChild(totalCountTd);
    
                // Calculate and add the remaining column
                const remainingTd = document.createElement("td");
                remainingTd.textContent = row["Meal Count"] - row["Total Count"];
                tr.appendChild(remainingTd);
    
                tableBody.appendChild(tr);
            }
        }
      });
    });
  }
  

