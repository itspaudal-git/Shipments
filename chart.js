
// Get the total and scanned values
var total = parseInt(document.getElementById('total').textContent);
var scanned = parseInt(document.getElementById('scanned').textContent);
var unscanned = total - scanned;
console.log('Unscanned:', unscanned);

// Create a pie chart with the total, scanned, and unscanned values
var ctx = document.getElementById('pie-chart').getContext('2d');
var chart = new Chart(ctx, {
type: 'pie',
data: {
    labels: ['Scanned', 'Unscanned'],
    datasets: [{
    backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
    data: [scanned, unscanned]
    }]
}
});

// Position the pie chart in the top right corner of the page
var chartElement = document.getElementById('pie-chart');
chartElement.style.position = 'fixed';
chartElement.style.top = '15px';
chartElement.style.right = '15px';

