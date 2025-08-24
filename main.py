import google.generativeai as genai
from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Configure the API key
genai.configure(api_key="AIzaSyC7FFNXKUJyifOj7HGWquxdQ61SrYm9Xj8")

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')

# Start a chat session
chat = model.start_chat()

# Serve the main HTML file
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Chat API endpoint
@app.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json()
    message = data.get('message', '')
    
    try:
        # Get response from the model
        response = chat.send_message(message)
        
        return jsonify({
            "success": True,
            "response": response.text
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Serve static files (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    # Run on all network interfaces (0.0.0.0) for external access
    app.run(host='0.0.0.0', port=5001, debug=True)
