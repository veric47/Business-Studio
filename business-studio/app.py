from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
# Enable CORS so your React frontend (port 5173/5174) can communicate with Flask (port 5000)
CORS(app)

DB_FILE = 'database.json'

def load_db():
    """Helper to read our local JSON file workspace storage."""
    if not os.path.exists(DB_FILE):
        return {}
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return {}

def save_db(data):
    """Helper to write workspace configuration payloads to disk."""
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/api/save-layout', methods=['POST'])
def save_layout():
    """API endpoint to receive and store layout configurations."""
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"status": "error", "message": "No data received"}), 400
        
        # Pull the unique subdomain string or business identity to map the structural layout
        subdomain = payload.get('subdomain', 'default_workspace')
        
        # Load existing data records, map the new schema payload, and commit to disk
        db_records = load_db()
        db_records[subdomain] = payload
        save_db(db_records)
        
        print(f"📁 Successfully saved workspace mapping schema for: {subdomain}")
        return jsonify({"status": "success", "message": "Configuration saved cleanly to database cluster"}), 200
        
    except Exception as e:
        print(f"❌ Error handling payload: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/get-layout/<subdomain>', methods=['GET'])
def get_layout(subdomain):
    """API endpoint to retrieve a layout by its namespace subdomain."""
    db_records = load_db()
    layout_schema = db_records.get(subdomain)
    
    if not layout_schema:
        return jsonify({"status": "error", "message": "Subdomain layout records not found"}), 404
        
    return jsonify({"status": "success", "data": layout_schema}), 200

if __name__ == '__main__':
    print("🚀 Database initialized! Flask routing engine active.")
    app.run(debug=True, port=5000)