// Function to fetch and update card values with real-time data
function updateCardValues() {
  fetch('https://wqms.onrender.com//send_data') // Replace with your Flask app's URL
    .then(response => response.json())
    .then(data => {
      console.log('Data received:', data)
      // Assuming data is an array of objects with keys: timestamp, temperature, ph, turbidity, tds
      if (data.length > 0) {
        // Update Temperature Card
        document.getElementById('temperatureValue').textContent = data[data.length - 1].temperature + '°C';

        // Update pH Card
        document.getElementById('phValue').textContent = data[data.length - 1].ph;

        // Update Turbidity Card
        document.getElementById('turbidityValue').textContent = data[data.length - 1].turbidity + ' NTU';

        // Update TDS Card
        document.getElementById('tdsValue').textContent = data[data.length - 1].tds + ' ppm';
      }
    })
    .catch(error => {
      console.error('Error fetching real-time data:', error);
    });
}

// Call the updateCardValues function periodically (e.g., every 5 seconds)
setInterval(updateCardValues, 5000); // Adjust the interval as needed

