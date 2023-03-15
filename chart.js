// Initialize total to 0
var total = 0;
// Set the initial value of total in the HTML
document.getElementById("total").innerHTML = total;

// Function to update the pie chart and percentages
function updatePieChart(scanned, unscanned) {
  // Calculate the percentages
  var scannedPercentage = (scanned / total) * 100;
  var unscannedPercentage = 100 - scannedPercentage;

  // Update the pie chart data
  chart.data.datasets[0].data = [scanned, unscanned];
  chart.update();

  // Update the percentages in the HTML
  document.getElementById('scanned-percentage').textContent = Math.round(scannedPercentage) + '%';
  document.getElementById('unscanned-percentage').textContent = Math.round(unscannedPercentage) + '%';
}