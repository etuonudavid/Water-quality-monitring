from flask import Flask, request, jsonify, render_template, url_for
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.app_context().push()

app.config['SECRET_KEY'] = 'helloworld'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # SQLite database

db = SQLAlchemy(app)

from Model import SensorData

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

        return "Data received and saved successfully", 200
    except Exception as e:
        return str(e), 400

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


if __name__ == '__main__':
    app.run(debug=True)
