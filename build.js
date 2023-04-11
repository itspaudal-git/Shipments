if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

document.getElementById("facility").addEventListener("change", function () {
    updateDashboard();
});

document.getElementById("selectTerm").addEventListener("change", function () {
    updateDashboard();
});

document.getElementById("selectCycle").addEventListener("change", function () {
    updateDashboard();
});

document.getElementById("selectConfig").addEventListener("change", function () {
    updateDashboard();
});

function updateDashboard() {
    const fc = document.getElementById("facility").value;
    const term = document.getElementById("selectTerm").value;
    const cycle = document.getElementById("selectCycle").value;
    const config = document.getElementById("selectConfig").value;

    if (!term) {
        return;
    }

    displayExcludedMeals(config);
    displayDashboardData(fc, term, cycle, config);
}

async function displayExcludedMeals(config) {
    const mealConfigRef = firebase.database().ref("Meal Configuration");
    const mealSnapshot = await mealConfigRef.once("value");
    const mealData = mealSnapshot.val();

    const excludedMeals = Object.values(mealData)
        .filter(mealRow => mealRow.Config === config)
        .map(mealRow => parseInt(mealRow["Meal No"]) / 100)
        .join(", ");

    document.getElementById("excludedMeals").innerText = excludedMeals ? `Excluding meals: ${excludedMeals}` : "";
}

async function displayDashboardData(fc, term, cycle, config) {
    // Retrieve data from Firebase
    const dataRef = firebase.database().ref("Master");
    const mealConfigRef = firebase.database().ref("Meal Configuration");

    const snapshot = await dataRef.orderByChild("Term").equalTo(term).once("value");
    const rawData = snapshot.val();

    // Flatten the data structure
    let data = [];
    for (const key in rawData) {
        if (rawData.hasOwnProperty(key) && rawData[key].hasOwnProperty("Term")) {
            data.push(rawData[key]);
        }
    }

    const mealSnapshot = await mealConfigRef.once("value");
    const mealData = mealSnapshot.val();

    // Filter and aggregate data
    const filteredData = Object.values(data).filter(row => {
        const locationMatches = fc === "" || row.fc.toLowerCase() === fc.toLowerCase();
        if (!locationMatches) {
            return false;
        }
        const mealNumbers = row["Meal_Selection"].split(",").map(num => parseInt(num, 10) * 100);
    
        return mealNumbers.every(mealNumber => {
            const mealConfig = Object.values(mealData).find(mealRow => mealRow["Meal No"] === mealNumber.toString());
    
            if (!mealConfig) {
                return false;
            }
    
            if (config === "") {
                return true;
            }
    
            if (config === mealConfig.Config) {
                return false;
            }
    
            const cycleMatches = cycle === "" || mealConfig.Cycle === cycle;
            const locationMatches = fc === "" || mealConfig.fc.toLowerCase() === fc.toLowerCase();
    
            return cycleMatches && locationMatches;
        });
    });

    // Filter data based on the selected cycle
    const cycleFilteredData = filteredData.filter(row => {
        if (cycle === "") {
            return true;
        }
        return row["Cycle"] === cycle;
    });

    console.log('Cycle Filtered Data:', cycleFilteredData);
    
    // Clear table body
    const tableBody = $("#dashboardTable").DataTable();
    tableBody.clear();

    // Populate table with filtered data
    cycleFilteredData.forEach(row => {
        tableBody.row.add([
            row["shipping_company"],
            row["shipping_origin"],
            row["subscription_type"],
            row["insulation_type"],
            row["Meal_Selection"],
            row["box_extras"],
            row["shipping_name"],
            row["Cycle"],
        ]).draw();
    });

    tableBody.order([6, 'asc']).draw(); // Sort by ShipDate column (assuming it's the 7th column)

}



function downloadCSV() {
    const tableData = $("#dashboardTable").DataTable().data().toArray();
    const headers = ['shipping_company', 'shipping_origin', 'subscription_type', 'insulation_type', 'Meal_Selection', 'box_extras', 'shipping_name','OrderfulfillmentId'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + tableData.map(e => {
        const modifiedRow = [...e];
        modifiedRow[4] = `"${modifiedRow[4]}"`; // Wrap the Meal_Selection value with double quotes
        modifiedRow[5] = `"${modifiedRow[5]}"`; 
        return modifiedRow.join(",");
    }).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_data.csv");
    document.body.appendChild(link); // Required for Firefox

    link.click();
    document.body.removeChild(link);
}

document.getElementById("openGoogleSheets").addEventListener("click", function () {
    const tableData = $("#dashboardTable").DataTable().data().toArray();
    const headers = ['shipping_company', 'shipping_origin', 'subscription_type', 'insulation_type', 'Meal_Selection', 'box_extras', 'shipping_name'];
    const csvContent = headers.join(",") + "\n" + tableData.map(e => e.join(",")).join("\n");
    const encodedCsvContent = btoa(unescape(encodeURIComponent(csvContent)));

    const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/1nA_gGvJwzgEzxPnKZLLYQe1vBh6AeJ6Xy8Wq3K6Mwrc/edit#gid=0&range=A1&data=${encodedCsvContent}`;
    window.open(googleSheetsUrl, '_blank');
});
