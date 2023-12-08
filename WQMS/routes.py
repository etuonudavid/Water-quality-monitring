import pandas as pd
from flask import request, jsonify, render_template, url_for, Response
from WQMS import app, db, mail
from WQMS.Model import SensorData
from flask_mail import Message
from datetime import datetime


# Define the email alert interval (12 hours)
alert_interval = 43200  # 12 hours minutes in seconds
last_alert_time = None

thresholdValues = {
    'temperature': 32,  # Set your temperature threshold value
    'ph': 8.6,          # Set your pH threshold value
    'turbidity': 900,    # Set your turbidity threshold value
    'tds': 350          # Set your TDS threshold value
}



@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('About.html')


@app.route('/table')
def table():
    return render_template('table.html')


#This route receives the data from the ESP-8266 module and saves in the database
@app.route('/receive_data', methods=['POST'])
def receive_data():
    try:
        data = request.json  # Assuming the data sent is in JSON format
        print(data)

        sensor_data = SensorData(
            temperature=data.get('temperature'),
            tds=data.get('tds'),
            turbidity=data.get('turbidity'),
            ph=data.get('ph')
        )

        db.session.add(sensor_data)
        db.session.commit()


        # Call the send_email_alert function
        send_email_alert(data, thresholdValues)

        return "Data received and saved successfully", 200
    except Exception as e:
        return str(e), 400

# Function to send email alert
def send_email_alert(data, thresholdValues):
    global last_alert_time

    current_time = datetime.now()

    if (
        not last_alert_time or
        (current_time - last_alert_time).seconds >= alert_interval
    ):
        # Send an email alert
        last_alert_time = current_time

        # Create the email message
        msg = Message('Sensor Data Alert', sender='monitoringwaterquality176@gmail.com', recipients=['davidetuonu15@gmail.com'])  # Replace with your recipient's email
        current_data = data
        alert_message = ''

        if current_data['temperature'] > thresholdValues['temperature']:
            alert_message += 'Temperature value exceeded the threshold.\n'

        if current_data['ph'] > thresholdValues['ph']:
            alert_message += 'pH value exceeded the threshold.\n'

        if current_data['turbidity'] > thresholdValues['turbidity']:
            alert_message += 'Turbidity value exceeded the threshold.\n'

        if current_data['tds'] > thresholdValues['tds']:
            alert_message += 'TDS value exceeded the threshold.\n'

        if alert_message:
            msg.body = alert_message
            mail.send(msg)

#This route sends the data to the front end
@app.route('/send_data', methods=['GET'])
def get_data():
    try:
        data = SensorData.query.all()
        data_list = []

        for item in data:
            data_entry = {
                'timestamp': item.timestamp,
                'temperature': item.temperature,
                'tds': item.tds,
                'turbidity': item.turbidity,
                'ph': item.ph
            }
            data_list.append(data_entry)
        return jsonify(data_list), 200
    except Exception as e:
        return str(e), 400


@app.route('/export_csv', methods=['GET'])
def export_csv():
    # Query the database to fetch data from the SensorData table
    data = SensorData.query.all()

    if not data:
        return 'No data to export', 404

    # Create a DataFrame from the data
    data_dict = [{'timestamp': entry.timestamp, 'temperature': entry.temperature, 'tds': entry.tds, 'turbidity': entry.turbidity, 'ph': entry.ph} for entry in data]
    df = pd.DataFrame(data_dict)

    # Convert the DataFrame to CSV
    csv_data = df.to_csv(index=False)

    # Create a Response object and set the content type to CSV
    response = Response(csv_data, content_type='text/csv')
    response.headers["Content-Disposition"] = "attachment; filename=data.csv"

    return response






