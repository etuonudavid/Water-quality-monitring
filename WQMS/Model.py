from WQMS import db
from datetime import datetime


#creation of the databaase schema for storing the sensor data
class SensorData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    temperature = db.Column(db.Float)
    tds = db.Column(db.Float)
    turbidity = db.Column(db.Float)
    ph = db.Column(db.Float)

    def __repr__(self):
        return f"Sensor data: '{self.timestamp}', '{self.temperature}', '{self.tds}', '{self.turbidity}', '{self.ph}'"
