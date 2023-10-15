let lastShownAlertParameter = null;

function checkDataAndShowAlerts(data, thresholdValues) {
  const currentData = data[data.length - 1];

  if (!currentData) return; // Prevent errors when no data is available

  const showAlertForParameter = (parameter, value) => {
    showAlertMessage('danger', `${parameter} value exceeded the threshold!`);
    lastShownAlertParameter = parameter;
  };

  const hideAlertForParameter = () => {
    hideAlertContainer();
    lastShownAlertParameter = null;
  };

  if (currentData.temperature > thresholdValues.temperature) {
    showAlertForParameter('Temperature', currentData.temperature);
  } else if (lastShownAlertParameter === 'Temperature') {
    hideAlertForParameter();
  }

  if (currentData.ph > thresholdValues.ph) {
    showAlertForParameter('pH', currentData.ph);
  } else if (lastShownAlertParameter === 'pH') {
    hideAlertForParameter();
  }

  if (currentData.turbidity > thresholdValues.turbidity) {
    showAlertForParameter('Turbidity', currentData.turbidity);
  } else if (lastShownAlertParameter === 'Turbidity') {
    hideAlertForParameter();
  }

  if (currentData.tds > thresholdValues.tds) {
    showAlertForParameter('TDS', currentData.tds);
  } else if (lastShownAlertParameter === 'TDS') {
    hideAlertForParameter();
  }
}

function hideAlertContainer() {
  const container = document.getElementById('message-container');
  container.style.display = 'none';
}

function showAlertMessage(type, message) {
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;

  const container = document.getElementById('message-container');
  container.innerHTML = ''; // Clear previous alerts
  container.appendChild(alertElement);
  container.style.display = 'block'; // Make the container visible
}

function fetchAndCheckData(thresholdValues) {
  fetch('https://wqms.onrender.com/send_data')
    .then(response => response.json())
    .then(data => {
      checkDataAndShowAlerts(data, thresholdValues);
    })
    .catch(error => {
      console.error('Error fetching and checking data:', error);
    });
}

const sampleThresholdValues = {
  temperature: 25,
  ph: 6.5,
  turbidity: 15,
  tds: 100,
};

setInterval(() => {
  fetchAndCheckData(sampleThresholdValues);
}, 9000);
