from flask import Flask, request, jsonify, send_from_directory
from werkzeug.exceptions import BadRequest
import json
import os
from datetime import datetime
from validators import validate_temperature, validate_threshold

# --- Configuration ---
app = Flask(__name__)
SENSOR_DATA_FILE = 'sensor_data.json'
HISTORY_FILE = 'history.json'

# --- Helper Functions ---

def read_json_file(file_path):
    """Reads data from a JSON file."""
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r') as f:
        return json.load(f)

def write_json_file(file_path, data):
    """Writes data to a JSON file."""
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

def initialize_data_files():
    """Creates data files with default content if they don't exist."""
    if not os.path.exists(SENSOR_DATA_FILE):
        write_json_file(SENSOR_DATA_FILE, {
            "temperature": 0,
            "humidity": 0,
            "status": "UNKNOWN",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    if not os.path.exists(HISTORY_FILE):
        write_json_file(HISTORY_FILE, [])

# --- API Routes ---

@app.route('/api/sensor', methods=['GET', 'POST'])
def handle_sensor_data():
    """\
    POST: Receive temperature/humidity/status, overwrite sensor_data.json with the latest reading,
          and append the reading to history.json.
    GET:  Return the latest reading from sensor_data.json.
    """
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            raise BadRequest('Invalid JSON payload')

        temp = data.get('temperature')
        humidity = data.get('humidity')
        status = data.get('status', 'UNKNOWN')

        # Validate incoming data
        # temperature must be a number; humidity must be a number within 0..100
        try:
            humidity_num = float(humidity)
            temp_num = float(temp)
        except (TypeError, ValueError):
            raise BadRequest('Invalid sensor data: temperature or humidity is invalid.')

        if not validate_temperature(temp_num) or not validate_threshold(int(humidity_num)):
            raise BadRequest('Invalid sensor data: temperature or humidity is invalid.')

        new_reading = {
            "temperature": temp_num,
            "humidity": humidity_num,
            "status": status,
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        write_json_file(SENSOR_DATA_FILE, new_reading)

        history = read_json_file(HISTORY_FILE)
        if history is None:
            history = []
        history.append(new_reading)
        write_json_file(HISTORY_FILE, history)

        return jsonify({"message": "Sensor data received successfully"}), 201

    # GET
    data = read_json_file(SENSOR_DATA_FILE)
    if data is None:
        return jsonify({"error": "No sensor data available"}), 404
    return jsonify(data)


@app.route('/api/history', methods=['GET'])
def get_history():
    """Returns all historical sensor data."""
    history = read_json_file(HISTORY_FILE)
    if history is None:
        return jsonify({"error": "No history data available"}), 404
    return jsonify(history)

@app.route('/api/history', methods=['DELETE'])
def delete_history():
    """Clears all historical sensor data."""
    write_json_file(HISTORY_FILE, [])
    return jsonify({"message": "History cleared successfully"}), 200

# --- Serve Static Files (HTML, CSS, JS) ---

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serves static files from the root directory."""
    # Prevent directory traversal attacks
    if '..' in path:
        return jsonify({"error": "Forbidden"}), 403
    return send_from_directory('.', path)

# --- Main Execution ---

if __name__ == '__main__':
    initialize_data_files()
    app.run(host='0.0.0.0', port=5000, debug=True)

