from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from routes.send_message import send_message_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register routes
try:
    app.register_blueprint(send_message_bp, url_prefix='/api')
    print(f"✓ Registered blueprint: send_message_bp with prefix /api")
    print(f"✓ Available routes:")
    for rule in app.url_map.iter_rules():
        print(f"  - {rule.rule} [{', '.join(rule.methods)}]")
except Exception as e:
    print(f"✗ Error registering blueprint: {e}")
    import traceback
    traceback.print_exc()

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Backend server is running'
    }), 200

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': str(error)
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    app.run(host='0.0.0.0', port=port, debug=True)

