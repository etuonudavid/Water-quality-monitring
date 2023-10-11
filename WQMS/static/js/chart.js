
// Function to fetch and update real-time data
function updateRealtimeData() {
  fetch('https://wqms.onrender.com//send_data') // Replace with the actual endpoint for fetching data
    .then(response => response.json())
    .then(data => {
      // Extract hours and minutes from the timestamp and format as "hh:mm"
      const formattedTimestamps = data.map(entry => {
        const timestamp = new Date(entry.timestamp);
        const hours = timestamp.getHours().toString().padStart(2, '0'); // Ensure two digits
        const minutes = timestamp.getMinutes().toString().padStart(2, '0'); // Ensure two digits
        return `${hours}:${minutes}`;
      });

      // Update Chart 1
      chart1.data.labels = formattedTimestamps;
      chart1.data.datasets[0].data = data.map(entry => entry.temperature);
      chart1.update();

      // Update Chart 2
      chart2.data.labels = formattedTimestamps;
      chart2.data.datasets[0].data = data.map(entry => entry.ph);
      chart2.update();

      // Update Chart 3
      chart3.data.labels = formattedTimestamps;
      chart3.data.datasets[0].data = data.map(entry => entry.turbidity);
      chart3.update();

      // Update Chart 4
      chart4.data.labels = formattedTimestamps;
      chart4.data.datasets[0].data = data.map(entry => entry.tds);
      chart4.update();
    })
    .catch(error => {
      console.error('Error fetching real-time data:', error);
      console.error(error.stack);
    });
}


var options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

// Create four chart instances
var ctx1 = document.getElementById('chart1').getContext('2d');
var ctx2 = document.getElementById('chart2').getContext('2d');
var ctx3 = document.getElementById('chart3').getContext('2d');
var ctx4 = document.getElementById('chart4').getContext('2d');

var chart1 = new Chart(ctx1, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Temperature Graph",
      data: [],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1
    }]
  },
  options: options
});

var chart2 = new Chart(ctx2, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "pH graph",
      data: [],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1
    }]
  },
  options: options
});

var chart3 = new Chart(ctx3, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "Turbidity Graph",
      data: [],
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 1
    }]
  },
  options: options
});

var chart4 = new Chart(ctx4, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: "TDS Graph",
      data: [],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    }]
  },
  options: options
});

// Call the updateRealtimeData function periodically (e.g., every 5 seconds)
setInterval(updateRealtimeData, 5000); // Adjust the interval as needed